// Worker minimo, scritto a mano (non generato da Astro): il sito resta interamente
// statico (build Astro → dist/, servita via "assets"), ma gli avvisi ora vivono in D1 e
// servono due manciate di rotte dinamiche per leggerli/scriverli. Tutto il resto della
// richiesta ricade sugli asset statici tramite env.ASSETS.fetch().
//
// /admin/*  è protetto da Cloudflare Access (configurato nella dashboard, non nel
// codice): Access blocca le richieste non autenticate prima che arrivino qui. Il
// controllo su Cf-Access-Jwt-Assertion sotto è una seconda verifica di difesa in
// profondità, nel caso /admin/* venga esposto senza passare da Access per errore.
export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

interface Avviso {
  id: number;
  title: string;
  text: string;
  date: string;
}

function json(data: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers ?? {}) },
  });
}

function isAccessAuthenticated(request: Request): boolean {
  return request.headers.get('Cf-Access-Jwt-Assertion') !== null;
}

async function listAvvisi(env: Env): Promise<Avviso[]> {
  const { results } = await env.DB.prepare(
    'SELECT id, title, text, date FROM avvisi ORDER BY date DESC, id DESC',
  ).all<Avviso>();
  return results ?? [];
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Redirect www → non-www: il canonico è rifugiobrunone.it senza www.
    if (url.hostname === 'www.rifugiobrunone.it') {
      url.hostname = 'rifugiobrunone.it';
      return Response.redirect(url.toString(), 301);
    }

    // Lettura pubblica: la usa il widget "Avvisi" in home, per tutti i visitatori.
    if (url.pathname === '/api/avvisi' && request.method === 'GET') {
      return json(await listAvvisi(env));
    }

    // Tutto ciò che segue è sotto /admin/api/ ed è protetto da Cloudflare Access.
    if (url.pathname.startsWith('/admin/api/')) {
      if (!isAccessAuthenticated(request)) {
        return json({ error: 'Non autenticato' }, { status: 401 });
      }

      if (url.pathname === '/admin/api/whoami' && request.method === 'GET') {
        const email = request.headers.get('Cf-Access-Authenticated-User-Email') ?? 'sconosciuto';
        return json({ email });
      }

      if (url.pathname === '/admin/api/avvisi' && request.method === 'GET') {
        return json(await listAvvisi(env));
      }

      if (url.pathname === '/admin/api/avvisi' && request.method === 'POST') {
        const body = (await request.json()) as Partial<{
          title: string;
          text: string;
          date: string;
        }>;
        if (!body.title?.trim() || !body.text?.trim() || !body.date?.trim()) {
          return json({ error: 'title, text e date sono obbligatori' }, { status: 400 });
        }
        await env.DB.prepare('INSERT INTO avvisi (title, text, date) VALUES (?, ?, ?)')
          .bind(body.title.trim(), body.text.trim(), body.date.trim())
          .run();
        return json({ ok: true }, { status: 201 });
      }

      const deleteMatch = url.pathname.match(/^\/admin\/api\/avvisi\/(\d+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        await env.DB.prepare('DELETE FROM avvisi WHERE id = ?').bind(Number(deleteMatch[1])).run();
        return json({ ok: true });
      }

      return json({ error: 'Non trovato' }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
