<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//IT">
<html>

    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <meta name="keywords" content="rifugio baroni brunone, rifugio baroni valbondione, rifugio baroni bergamo, valbondione, rifugio brunone, fiumenero, sentiero orobie" />
		<link href="/css/style.css" rel="stylesheet" type="text/css" />
        <link href="/css/gallery.css" rel="stylesheet" />
        <link href="/lightbox/css/lightbox.css" rel="stylesheet" />

        <title>Rifugio Brunone - News</title>
        
        <script type="text/javascript" src="/lightbox/js/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" src="/lightbox/js/lightbox-2.6.min.js"></script>

    </head>

    <body>
        <div class="page">
            <div class="header">
                <a href="index.html" id="logo">
                    <img src="/images/banner1.png" alt="">
                </a>
                <ul>
                    <li><a href="index.html">Home</a>
                    </li>
                    <li><a href="comeraggiungerci.html">Dove siamo</a>
                    </li>
                    <li><a href="rifugio.html">Il rifugio</a>
                    </li>
                    <li><a href="immagini.html">Immagini</a>
                    </li>
                    <li><a href="contatti.html">Contatti</a>
                    </li>
                </ul>
            </div>


            <div class="body">
                <br>
                <div class="news">
                    <div class="titolo">Avvisi</div>
                   <!-- Avvisi Dinamici, creati dall'area Admin -->
                   <% if (request.getAttribute("avvisoImportante").equals("true")) {
                       out.println("<h1>" + request.getAttribute("titoloAvviso") + "</h1>"); 
                   } else {
                       out.println("<h3>" + request.getAttribute("titoloAvviso") + "</h3>"); 
                   } %>
                   
                   <% out.println("<p>" + request.getAttribute("testoAvviso") + "</p>"); %>
                   
                    <h1>APERTURA ANNO 2014</h1>	
                    <p>Aperture nei fine settimana dal 01/06 al 15/06 e dal 20/09 al 12/10. <br> 
                        Apertura continuativa dal 21/06 al 14/09.
                    </p>

					<h2>ATTENZIONE - SENTIERO N�227 FIUMENERO - RIFUGIO BRUNONE</h2>
                    <p>Il sentiero che sale al rifugio presenta tre masse nevose lasciate 
                       	da valanghe. Al di sotto di queste scorre acqua che sta scavando delle cavit�. 
                       	Esiste il rischio che la superficie possa cedere con conseguente caduta 
                       	nel vuoto e nel torrente sottostante. <br>
						Attualmente sono in corso delle verifiche e, in alcuni tratti, sono state 
						realizzate delle deviazioni provvisorie per aggirare la neve. <br>
						<font color="black"><b>IGNORARE tali deviazioni e attraversare la massa nevosa vuol dire rischiare la propria vita!</b>
						<b>SEGUITE le deviazioni!!! </b> </font> <br>
						Ulteriori informazioni qui:<a href="http://geoportale.caibergamo.it/"> Avviso CAI</a>						
                    </p>
                       	
                    <h3>Riapertura CAI 330</h3>
                    <p>Il sentiero CAI 330 (sentiero "basso") dal rifugio Coca, � stato riaperto. 
                    	 Si ricorda che � adatto ad Escursionisti Esperti; 
                    	 il tracciato e l'esposizione richiedono grande attenzione e non sono affrontabili da tutti. <br>
                    </p>   
                    
                    <!-- Avvisi con immagini -->
                    <h3>Preparazione della presa d'acqua - Situazione Inizio Giugno 2014</h3>       
                    <div class="gallery-thumbnail-box">
                        <div class="gallery-thumbnail">
                            <a href="/photos/recent/original/1.jpg" data-lightbox="image-1" title="">
                                <img src="/photos/recent/original/1.jpg" width="290" height="220" />
                            </a>
                        </div>
                        <div class="gallery-thumbnail">
                            <a href="/photos/recent/original/2.jpg" data-lightbox="image-1" title="">
                                <img src="/photos/recent/original/2.jpg" width="290" height="220" />
                            </a>
                        </div>
                        <div class="gallery-thumbnail">
                            <a href="/photos/recent/original/3.jpg" data-lightbox="image-1" title="">
                                <img src="/photos/recent/original/3.jpg" width="290" height="220" />
                            </a>                                     
                </div>

                <div class="footer">
                    <p>Copyright &copy; 2013 Matteo Danelli - All rights reserved</p>
                    <div class="connect">
                         <a href="http://www.facebook.com/sharer.php?u=http://www.rifugiobrunone.it" id="facebook">facebook</a> 
                        	<a href="http://twitter.com/home?status=Visita%20il%20sito%20del%20Rifugio%20Brunone!%20www.rifugiobrunone.it" id="twitter">twitter</a> 
                        	<a href="https://plus.google.com/share?url=www.rifugiobrunone.it" id="google">google+</a> 
                    </div>
                </div>
            </div>
    </body>

</html>