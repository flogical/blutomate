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
		introVisible=!addOrRemove;

		console.log('introVisible= '+introVisible);

		$('main').toggleClass('nav-is-visible', addOrRemove);
		$('#home-container').toggleClass('nav-is-visible', addOrRemove);
		
	}

	//Scroll down
	$('#home-container').on('mousewheel', function(event) {
		if ( (event.deltaY<0)&&(introVisible==true) ){
			console.log('GO DOWN='+event.deltaY + '|  hide='+introVisible);
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
			
			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				//alert("POUET");
				window.onscroll = function () {};
			});
			$('#logo-container')
			.transition({opacity: 0, scale: 1.1},500)
		}
	});

	//Scroll up
	$('main').on('mousewheel', function(event) {
		console.log('Delta='+event.deltaY);
		console.log(window.scrollY);
		if ( (event.deltaY>0)&&(introVisible==false)&&(window.scrollY==0) ){
			console.log('GO UP='+event.deltaY + '|  hide='+introVisible);
			toggle3dBlock(!$('main').hasClass('nav-is-visible'));

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				//alert("PROUT");
				window.onscroll = function () { window.scrollTo(0, 0); };
			});
			$('#logo-container')
			.transition({opacity: 1, scale: 1, delay:1000},500)

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
			// launchLine02(!$('#name-container02').hasClass('goLine'));
		}
	})

	$('#btn').click(function() {
       // var searchValue = $('#searchForm').val();
	    var name = $('#name').val();
        var email = $('#email').val();
        var object = $('#object').val();
		var message = $('#message').val();
        var ajaxurl = "amit.php",
        data =  {'email': email, 'name':name, 'object':object, 'message':message };
        $.post(ajaxurl, data);
		
		//assuming that the send was successful...clear the input area
		name.value="";
		email.value="";
		object.value="";
		message.value="";
		
    });


});