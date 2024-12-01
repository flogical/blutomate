jQuery.fn.redraw = function() {
    return this.hide(0, function(){jQuery(this).show()});
};

jQuery(document).ready(function($){

	jQuery('body').redraw();
	
	var introVisible = true;
	var scrollPos;

	window.onscroll = function () { window.scrollTo(0, 0); };

	$('#logo-container')
		.transition({rotateY: '30deg', opacity: 0, scale: 0.8},0)
		.transition({rotateY: '0deg', opacity: 1, scale: 1, delay: 500},1000)
	

	function toggle3dBlock(addOrRemove) {

		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		activateScroll();
		introVisible=!addOrRemove;

		$('main').toggleClass('nav-is-visible', addOrRemove);
		$('#home-container').toggleClass('nav-is-visible', addOrRemove);
		$('#arrow').toggleClass('nav-is-visible', addOrRemove);
	
	}

	function activateScroll() {
		$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				window.onscroll = function () {};
			});
	}

	//Scroll down
	$('#home-container').on('mousewheel', function(event) {
		if ( (event.deltaY<0)&&(introVisible==true) ){
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
			
			$('#logo-container').transition({opacity: 0, scale: 1.1},500);
		}
	});

	//Scroll up
	$('main').on('mousewheel', function(event) {
		if ( (event.deltaY>0)&&(introVisible==false)&&(window.scrollY==0) ){
			toggle3dBlock(!$('main').hasClass('nav-is-visible'));

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				window.onscroll = function () { window.scrollTo(0, 0); };
			});
			$('#logo-container').transition({opacity: 1, scale: 1, delay:1000},500)

		}
	});

	$('#arrow').click(function() {
		toggle3dBlock();
	});

	//TOUCH TO GO

	$( "body" ).keypress(function( event ) {
		if (( event.which == 32 )&&(introVisible==true)) {
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
		}
	});

	
	

	$('.first-box').on('mouseover mouseout', function(){
		toggle3dBlock01(!$('.photo').hasClass('launchRot01'));
		launchLine(!$('#name-container').hasClass('goLine'));
	});

	function toggle3dBlock01(addOrRemove) {
		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		$('.photo').toggleClass('launchRot01', addOrRemove);		
	}
	function launchLine(addOrRemoveLine) {
		if(typeof(addOrRemoveLine)==='undefined') addOrRemoveLine = true;
		console.log('launchLine= '+addOrRemoveLine);
		$('#name-container').toggleClass('goLine', addOrRemoveLine);
	}

	//////////// Pouet 02

	$('.second-box').on('mouseover mouseout ', function(){
		toggle3dBlock02(!$('.photo').hasClass('launchRot02'));
		launchLine02(!$('#name-container02').hasClass('goLine'));
	});

	function toggle3dBlock02(addOrRemove) {
		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		$('.photo').toggleClass('launchRot02', addOrRemove);
	}
	function launchLine02(addOrRemoveLine) {
		if(typeof(addOrRemoveLine)==='undefined') addOrRemoveLine = true;
		console.log('launchLine= '+addOrRemoveLine);
		$('#name-container02').toggleClass('goLine', addOrRemoveLine);

	}

	//////////// Pouet 03
	$('.third-box').on('mouseover mouseout', function(){
		toggle3dBlock03(!$('.photo').hasClass('launchRot03'));
		launchLine03(!$('#name-container03').hasClass('goLine'));
	});

	function toggle3dBlock03(addOrRemove) {
		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		$('.photo').toggleClass('launchRot03', addOrRemove);

	}

	function launchLine03(addOrRemoveLine) {
		if(typeof(addOrRemoveLine)==='undefined') addOrRemoveLine = true;
		console.log('launchLine= '+addOrRemoveLine);
		$('#name-container03').toggleClass('goLine', addOrRemoveLine);
	}

	$(document).on('scroll',function(){
		if($(this).scrollTop()>= $('#photo-container').position().top){
		}
	})

	$('#btn').click(function() {
		var name = $('#name').val();
        var email = $('#email').val();
        var object = $('#object').val();
		var message = $('#message').val();
        var ajaxurl = "https://formspree.io/f/mrgdjwor"; //"amit.php";
        data =  {'email': email, 'name':name, 'object':object, 'message':message };
        //$.post(ajaxurl, data, function(result){
        //		$('#cava').text(result);
		//		console.log('RESULT= '+result);
   		// }); 
		//the above works well...except some CORS issue--tried to solve below

		
		$.ajax({
			type: "POST",
			url: ajaxurl,
			data: data,
			xhrFields: {
				withCredentials: true
			},
			success: function(result){
				$('#cava').text(result);
				console.log('RESULT= '+result);
			},
			error: function (xhr, status) {
				// handle errors
				console.log('ERROR= '+status + " ;;"+ xhr);
			},
			//headers: {  //doesnt work when this is not commented out
			//	"accept": "application/json",
			//	"Access-Control-Allow-Origin":"*"
			//}
			//dataType: 'json',
		  });
		
		//assuming that the send was successful...clear the input area
		name.value="";
		email.value="";
		object.value="";
		message.value="";
		$('#form')[0].reset();
		
    });


});