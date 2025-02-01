jQuery.fn.redraw = function() {
	//performance warning (but runs once at least!) 
	// BUT could pose issue with responsive and diff viewports >> https://api.jquery.com/hide/
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
			$('#logo-container').transition({opacity: 1, scale: 1, delay:100},500)

		}
	});

	$('#arrow').click(function() {
		toggle3dBlock();
	});

	//TOUCH TO GO

	//$( "body" ).keypress(function( event ) { // deprecated and replaced below
	//	if (( event.which == 32 )&&(introVisible==true)) {
	//		toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
	//	}
	//});
	$( "body" ).on( "keypress", function(event) {
		if (( event.which == 32 )&&(introVisible==true)) { //space-bar smh
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
		}
	});
	

	$('.first-box').on('mouseover mouseout', function(){
		toggle3dBlock01(!$('.photo').hasClass('launchRot01'));
		launchLine(!$('#name-container').hasClass('goLine'));
	});

	function toggle3dBlock01(addOrRemove) {
		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		$('.second-box .front').toggleClass('doHide', addOrRemove);	//serieux
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
		$('.second-box .front').removeClass('doHide');  //toggleClass('doHide', !addOrRemove);
		$('.third-box .bottom').toggleClass('doHide', !addOrRemove); 

		$('.photo').toggleClass('launchRot02', addOrRemove);

		$('.first-box .front').toggleClass('doHide', addOrRemove);
		$('.third-box .front').toggleClass('doHide', addOrRemove);
		$('.third-box .back').toggleClass('doHide', addOrRemove);
	}
	function launchLine02(addOrRemoveLine) {
		if(typeof(addOrRemoveLine)==='undefined') addOrRemoveLine = true;
		//console.log('launchLine= '+addOrRemoveLine);
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

		$('.first-box .bottom').toggleClass('doHide', addOrRemove);
		$('.second-box .bottom').toggleClass('doHide', addOrRemove);

	}

	function launchLine03(addOrRemoveLine) {
		if(typeof(addOrRemoveLine)==='undefined') addOrRemoveLine = true;
		console.log('launchLine= '+addOrRemoveLine);
		$('#name-container03').toggleClass('goLine', addOrRemoveLine);
	}

	$(document).on('scroll',function(){
		if($(this).scrollTop()>= $('#photo-container').position().top){
			//console.log('scrolled past photo-container?');
		}
	})

	function doReset(){
		document.getElementById("loader").style.display = "none";
		document.getElementById("submit").style.display = "inline-block";
		$('#form')[0].reset(); //just in case
	}
	function doShowLoader(){
		document.getElementById("loader").style.display = "inline-block";
  		document.getElementById("submit").style.display = "none";
	}

	function clearReturn(){
		var return_message = document.getElementById("returnmessage");
		return_message.innerHTML = '';
		return_message.style.backgroundColor = 'transparent';//or empty?
	}

	$('#btn').click(function() {
		var name = $('#name').val();
        var email = $('#email').val();
        var object = $('#object').val();
		var message = $('#message').val();
        var ajaxurl = "https://formspree.io/f/mrgdjwor"; //"amit.php";
		var gotcha = document.getElementsByName("gotcha");//filtering spam so that dont reach limit(50 per month)

		//console.log('click= '+email,gotcha.length,JSON.stringify(gotcha),JSON.stringify(gotcha[0]),gotcha[0].innerHTML); 
        data =  {'email': email, 'name':name, 'object':object, 'message':message,'_gotcha': gotcha[0].innerHTML};
        //$.post(ajaxurl, data, function(result){
        //		$('#cava').text(result);
		//		console.log('RESULT= '+result);
   		// }); 
		//the above works well...except some CORS issue--other try to solve below
		
		//below is like fetch smh
		//var xhr = new XMLHttpRequest();
		//xhr.open('POST', ajaxurl);
		
		//xhr.setRequestHeader('Access-Control-Allow-Origin',"http://localhost")
		//xhr.withCredentials = true;
		//xhr.send(data);
		
		//console.log('XMLHttpRequest= '+email,JSON.stringify(xhr),xhr.response);
		
		//var status = document.getElementById("form-status");
		var return_message = $('#returnmessage');//.val() //without val >> an array?!?
		//console.log('FORM_STATUS= '+email,form_status,JSON.stringify(form_status));
		doShowLoader(); //or use progress? https://www.w3schools.com/howto/howto_js_progressbar.asp
		$.ajax({
			type: "POST",
			url: ajaxurl,
			data: data,
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			success: function(result){
				//$('#cava').text(result);
				console.log('RESULT= '+result);
				return_message[0].innerHTML = "Thank you for your submission!";
				return_message[0].style.backgroundColor = '#68d99c';
				doReset();
				setTimeout(clearReturn, 2000);
				
				//setTimeout(function(){
				//	return_message[0].innerHTML = '';
				//	return_message[0].style.backgroundColor = 'transparent'; //or empty?
				//}, 2000)
			},
			error: function (xhr, status) {
				// handle errors
				console.log('ERROR= '+status + " ;; "+ JSON.stringify(xhr));
				//ERROR= error ;; {"readyState":0,"status":0,"statusText":"error"}
				if(xhr.status == 0 && xhr.readyState == 0){ //bon in testing this is a false error
					return_message[0].innerHTML = "Thank you for your submission!";
					return_message[0].style.backgroundColor = '#68d99c';
					doReset();
					alert("Sent"); //or also set innerHTML as below instead of alert?!?
					setTimeout(clearReturn, 2000);
					return;
				}

				return_message[0].innerHTML = "Oops! There was a problem submitting your form"; //this works...
				return_message[0].style.backgroundColor = '#FF0000';
				//alert("euuuh");	
				setTimeout(clearReturn, 2000);
				//setTimeout(function(){
				//	return_message[0].innerHTML = '';
				//	return_message[0].style.backgroundColor = 'transparent'; //or empty?
				//}, 2000)
			},
			//headers: {  //doesnt work when this is not commented out
			//	"accept": "application/json",
			//	"Access-Control-Allow-Origin":"*"
			//}
			//dataType: 'json',
		  })
		
		//assuming that the send was successful...clear the input area
		//name.value="";
		//email.value="";
		//object.value="";
		//message.value="";
		$('#form')[0].reset(); //umm as array access!!

		//var form = document.getElementById("form");var form =$('#form')//.val()
		
		//other try....
		//console.log('FORM= '+email,form,JSON.stringify(form),JSON.stringify(data));
		//this dont work? >>blocked by cors smh gotta test only online?!?
		/*fetch(ajaxurl, { //event.target.action
			method: "POST",//form.method,
			body: data,
			referrer:'',//'http://localhost:9000',//helps with cors? nope //"about:client
			headers: {
				'Accept': 'application/json',
				'Access-Control-Allow-Origin':'http://localhost:9000',   //prob to submit when this here
				'Access-Control-Allow-Credentials':true
			}
		  }).then(response => {
			if (response.ok) {
				form_status.innerHTML = "Thanks for your submission!";
			  	form.reset()  //toSee with val() //below equivalent?
			  	//$('#form').reset()
			} else {
			  response.json().then(data => {
				console.log('BOO response= ',data,JSON.stringify(data));
				if (Object.hasOwn(data, 'errors')) {
					form_status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
				} else {
					form_status.innerHTML = "Oops! There was a problem submitting your form"
				}
			  })
			}
		  }).catch(error => {
			console.log('BOO ERROR= ',error,JSON.stringify(error));
			form_status[0].innerHTML = "Oops! There was a problem submitting your form"; //this works...
			form_status[0].style.backgroundColor = '#FF0000';// = "Red";
			//form_status = "Oops!";
			//$('#form-status')[0].value = "Oops!";
			//form_status.val().innerHTML = "Oopszzz!";
		  });*/

		//name.value="";
		//email.value="";
		//object.value="";
		//message.value="";
		//$('#form')[0].reset(); //huh is an array...and no need for above setting to empty...
    });


});