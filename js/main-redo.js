/*
Redo of main.js to use pointer events and other fixes! 
*/

jQuery.fn.redraw = function() {
    //performance warning (but runs once at least!) 
    // BUT could pose issue with responsive and diff viewports >> https://api.jquery.com/hide/
    return this.hide(0, function(){jQuery(this).show()});
};

jQuery(document).ready(function($){
	jQuery('body').redraw();
	//console.log(navigator.userAgentData.mobile); //huh could bork in Android?

	let w = $( window ).width();
	let d = $( document ).width();//huh larger than window?!? >> 'document' could extend far beyond 'window'
	let h = $( window ).height();
	let hd = $( document ).height();

	var consoley = { //helps show alert in Android
		log: function(msg) { alert(msg); }
	};

	var introVisible = true;
	const wheelType = 'onwheel' in window ? 'wheel' : 'mousewheel'; //huh nice
	//toRename clearly...
	//'onwheel' in document ; //mousewheel be deprecated but just in case
	
	//for handling both touch and mouse...//'touchstart' : 
	const eventType = 'ontouchstart' in window ? 'pointerenter pointerleave' : 'mouseover mouseout';

	//consoley.log("euuuh"+ w+" "+ d+" "+ h+" "+ hd);
	console.log("euuuh:Sizes", w, d, h, hd,wheelType,eventType);

	//fires lots ---prolly needed even?!? toReview**
	window.onscroll = function () { window.scrollTo(0, 0);}; 

	$('#logo-container')
		.transition({rotateY: '30deg', opacity: 0, scale: 0.8},0)
		.transition({rotateY: '0deg', opacity: 1, scale: 1, delay: 500},1000)
	
	
	function toggle3dBlock(addOrRemove) { //toRename** togglelanding?

		if(typeof(addOrRemove)==='undefined') addOrRemove = true;
		
		activateScroll();
		introVisible=!addOrRemove;

		//$('main').toggleClass('nav-is-visible', addOrRemove);
		//$('#home-container').toggleClass('nav-is-visible', addOrRemove);
		//$('#arrow').toggleClass('nav-is-visible', addOrRemove);

		// need to separate each? >>nope dont work >> $("main", "#home-container", "#arrow").toggleClass('nav-is-visible', addOrRemove);
		$("main, #home-container, #arrow").toggleClass('nav-is-visible', addOrRemove);
	}

	function activateScroll() {
		$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
			function(e) {
				//console.log("activateScroll..?!?",introVisible,e); //sometimes fires twice...prolly ok?
				window.onscroll = function () {};
			});
	}
	
	//Scroll down
	//using event.deltaY<0 with 'wheel' --undefined so gotta use event.originalEvent.deltaY 
	//event.originalEvent.deltaY with 'mousewheel' is exact reverse of event.deltaY (i.e: -28 vs 28)
	$('#home-container').on(wheelType, function(event) {  //oldie >> 'mousewheel'
		//event.preventDefault(); // Prevent user scroll during page jump--nah
		let visible = $('#home-container').hasClass('nav-is-visible');
		let deltY = wheelType == "wheel" ? event.originalEvent.deltaY > 0 : event.deltaY < 0

		//console.log("Scrolling DOWN..?",deltY)
		if ( introVisible && deltY ){ //event.deltaY<0
			//let visible = $('#home-container').hasClass('nav-is-visible');
			//event.originalEvent.deltaY<2  // originalEvent wrong value>>see above toReview**

			console.log("Scrolling DOWN:: home-container",visible,deltY,event.deltaY, event.originalEvent.deltaY);
			toggle3dBlock(!visible);

			//transition OR animate? no diff
			$('#logo-container').transition({opacity: 0, scale: 1.1},500);//, function() {
				// Animation complete.
				//console.log("logo-container::animate DOWN complete");
			  //}); 
		}//else{console.log("Scrolling DOWN..NOPE",visible, deltaY,event.deltaY, wheelType, event.originalEvent.deltaY, window.scrollY);}
	});

	//Scroll up
	//huh for scroll up >> event.deltaY,event.originalEvent.deltaY NOT always exact reverse as for scroll down above
	$('main').on(wheelType, function(event) { //wheelType //oldie >> 'mousewheel'
		//event.preventDefault(); // Prevent user scroll during page jump --nah
		let visible = $('main').hasClass('nav-is-visible');
		let deltaY = wheelType == "wheel" ? event.originalEvent.deltaY < 0 : event.deltaY > 0
		if ( (deltaY)&&(introVisible==false)&&(window.scrollY==0) ){
			//let visible = $('main').hasClass('nav-is-visible');
			//(event.deltaY>0)

			console.log("Scrolling UP::main",visible,deltaY, event.deltaY,event.originalEvent.deltaY);
			
			toggle3dBlock(!visible);

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				console.log("window Scrolling up...",visible, introVisible,event.originalEvent.deltaY, event.deltaY,window.scrollY);
				window.onscroll = function () { window.scrollTo(0, 0); };
			});

			$('#logo-container').transition({opacity: 1, scale: 1, delay:100},500);//,function() {
				// Animation complete.
				//console.log("logo-container::transition UP complete");
			  //});
		}//else{console.log("Scrolling UP..NOPE",visible, introVisible,deltaY,event.deltaY,window.scrollY,event.originalEvent.deltaY);}
	});

	let deltaY = 0;
	let lastKnownScrollPosition = 0;//add pointermove?
	$('main').on('pointerup pointercancel', function (event) { //pointerdown pointermove pointerup
		event.preventDefault(); // Prevents unwanted scrolls or zooms
		let visible = $('main').hasClass('nav-is-visible');

		//event.originalEvent.deltaY, event.deltaY >>both undefined
		let oldy = lastKnownScrollPosition;
		deltaY = window.scrollY - lastKnownScrollPosition;
    	lastKnownScrollPosition = window.scrollY;
		
		//Math.abs(deltaY)
		//console.log('Pointer Event:',visible,introVisible,oldy,deltaY,lastKnownScrollPosition,window.scrollY, event.clientY,event.screenY); //event event.type 

		if (deltaY >= 0 && introVisible==false &&(window.scrollY==0) ){
			//let visible = $('main').hasClass('nav-is-visible');
			//(event.deltaY>0)

			//console.log("Scrolling UP::main>>POINTER",visible,deltaY, event.deltaY,event.originalEvent.deltaY);
			
			toggle3dBlock(!visible);

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				console.log("PIONTER Scrolling up...",event.type);//,visible, introVisible,event.originalEvent.deltaY, event.deltaY,window.scrollY);
				window.onscroll = function () { window.scrollTo(0, 0); };
			});

			$('#logo-container').transition({opacity: 1, scale: 1, delay:100},500);//,function() {
				// Animation complete.
				//console.log("logo-container::transition UP complete");
			  //});
		}else{console.log("POINTER UP..NOPE",event.type,deltaY)}; 
	});

	// Handle both touch and mouse interactions.
	//$('div').on('pointerdown', '#arrow',function(e) { //dont fire in this form
	$("#arrow").on('pointerdown', function(e) {//touchstart
		//if (event.pointerType === 'touch') { //should use to confirm on touch device? meh no need
		//console.log("arrowCLICK....!!", e.clientY,e.screenY); //'mouse' on desktop, 'touch' on mobile
		//e.preventDefault(); //dont continue with click handler above in mobile? >>yup!!--still needed?
		toggle3dBlock();
		lastKnownScrollPosition = e.clientY ; //for when scroll back up with pointer

	});

	$( "body" ).on( "keypress", function(event) {
		if (( event.which == 32 )&&(introVisible==true)) { //space-bar smh
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
		}
	});

	////Refactor of those functions that rotate team bckgrd images/////

	// mouseover and mouseout event handler in Desktop OR touch event in mobile
	//'pointerenter pointerleave' better than 'touchstart'
	function handleImageEvent(selector, rotClass, lineSelector, lineClass, elementsToToggle = {}) {
		$(selector).on(eventType, function () {  //'mouseover mouseout'
			const shouldAddClass = !$('.photo').hasClass(rotClass);
			const launchyLine = !$(lineSelector).hasClass(lineClass);

			toggleBlockImage(shouldAddClass, rotClass, elementsToToggle);
			launchLine(launchyLine, lineSelector, lineClass);
		});
	}

	// Toggle image block function
	function toggleBlockImage(addOrRemove, rotClass, elements) {
		if (typeof addOrRemove === 'undefined') addOrRemove = true;
		//$('.photo').toggleClass(rotClass, addOrRemove);
		if(rotClass == 'launchRot02'){
			$('.second-box .front').removeClass('doHide');
			$('.third-box .bottom').toggleClass('doHide', !addOrRemove); 
		}

		for (const [selector, toggleClass] of Object.entries(elements)) {
			$(selector).toggleClass(toggleClass, addOrRemove);
		}

		//no issue executed last...
		$('.photo').toggleClass(rotClass, addOrRemove);
	}
  
	// Launch line function
	function launchLine(addOrRemove, lineSelector, lineClass) {
		if (typeof addOrRemove === 'undefined') addOrRemove = true;
		//console.log(`launchLine: ${addOrRemove}`);
		$(lineSelector).toggleClass(lineClass, addOrRemove);
	}

	//Setup listener for each image block
	handleImageEvent( //Pouet 01
		'.first-box',
		'launchRot01',
		'#name-container',
		'goLine',
		{ '.second-box .front': 'doHide' }
	);

	handleImageEvent( //Pouet 02
		'.second-box',
		'launchRot02',
		'#name-container02',
		'goLine',
		{//umm first two manually handled.
		  //'.second-box .front': 'doHide',
		  //'.third-box .bottom': 'doHide',
		  '.first-box .front': 'doHide',
		  '.third-box .front': 'doHide',
		  '.third-box .back': 'doHide',
		}
	);

	handleImageEvent( //Pouet 03
		'.third-box',
		'launchRot03',
		'#name-container03',
		'goLine',
		{
		  '.first-box .bottom': 'doHide',
		  '.second-box .bottom': 'doHide',
		}
	);

	//todo** use jqery instead of document.getElementById
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
        
		var return_message = $('#returnmessage');

		doShowLoader();

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

		$('#form')[0].reset();
	});

});