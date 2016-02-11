var pos=0;
var intv;

$(document).on('ready', function(){
	init();
});
$(window).on('resize', init);
window.addEventListener('orientationchange', init);

function init () {	

	$('#navegacionPrincipal').localScroll();
	
	$('.slider_controls li').on('click',handleClick);

	var width = $('.slider_container').width();

	$('.slide').each(function (i,e) {
		addBackground(e,width, true);
	});
	$('.image_food').on('click', changeViewPort);
	$('.image_food').each(function(i,e){
		addBackground(e,false);
		if($(e).hasClass('viewport')) return true;
		$(e).data('top',((i)*100))
		$(e).css({
			'top': $(e).data('top')+'px'
		})
	})
	
	intv = setInterval(handleClick, 10000);
}

google.maps.event.addDomListener(window, 'load', drawMap);
function drawMap(){
	var mapa;
	var opcionesMapa = {
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	mapa = new google.maps.Map(document.getElementById('google_canvas'), opcionesMapa);
	navigator.geolocation.getCurrentPosition(function(posicion){
		var geolocalizacion = new google.maps.LatLng(posicion.coords.latitude, 
			posicion.coords.longitude);
		var marcador = new google.maps.Marker({
			map: mapa,
			draggable: false,
			position: geolocalizacion,
			visible: true
		})
		marcador.setTitle('Direccion usuario');
		mapa.setCenter(geolocalizacion);
		calcRoute(geolocalizacion, mapa);
	});
}

function calcRoute(inicioRuta, mapa){
	var directionsService = new google.maps.DirectionsService();
	var directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(mapa);
	var posicionHotel = new google.maps.LatLng(41.6374032, 2.3606875);
	var marcador = new google.maps.Marker({
		map: mapa,
		draggable: false,
		position: posicionHotel,
		visible: true
	});

	var request = {
		origin: inicioRuta,
		destination: posicionHotel,
		travelMode: google.maps.DirectionsTravelMode.DRIVING
	}

	directionsService.route(request, function(response, status){
		if(status == google.maps.DirectionsStatus.OK){
			directionsRenderer.setDirections(response);
		}
	});
}

function changeViewPort(){
	var e= $('.viewport');
	e.css('top', $(e).data('top'));
	e.removeClass('viewport');
	$(this).addClass('viewport');
	$(this).css('top', 0);
}

function addBackground(element, width, setSize){
	if(!width) width = $('hmtl').width();
	if(setSize){
		$(element).css({
			'width': width,
			'height': $('html').height()
		});

	}

	var imagen = $(element).data('background');
	if ($('html').width() < 900) imagen = imagen +'-movil.jpg';
	else imagen = imagen +'.jpg';
	$(element).css('background-image', "url("+(imagen)+")");
	if ($(element).height() > $(element).width()) $(element).css('background-size', "auto 100%");
}

function handleClick () {	
	var slide_target=0;
	if($(this).parent().hasClass('slider_controls')){
		slide_target =$(this).index();
		pos = slide_target;
		clearInterval(intv);
		intv = setInterval(handleClick, 10000);
	}else{//funcionar intervalo de tiempo
		pos++;
		if(pos>=$('.slide').length){
			pos=0;
		}
		slide_target = pos; 
	}

	$('.slideContainer').fadeOut('slow', function(){
		$(this).animate({
			'margin-left':-(slide_target * $('.slider_container').width()) +'px'
		}, 'slow', function () {
			$(this).fadeIn();
		});

	});

}