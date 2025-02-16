/*
Redo of main.js to use pointer events and other fixes! 
*/

jQuery.fn.redraw = function() {
    //performance warning (Runs once at least!) 
    // BUT could pose issue with responsive and diff viewports >> https://api.jquery.com/hide/
    return this.hide(0, function(){jQuery(this).show()});
};

jQuery(document).ready(function($){
	jQuery('body').redraw();
	//console.log(navigator.userAgentData.mobile); //huh could bork in Android?

	// prevent the context menu from appearing during long presses BUT can interfere with user experience, as it prevents users from performing actions like copying text or images, 
	// moved below to more specific 'figure' elt
	//window.oncontextmenu = function() { //for debugging in emulator
		//console.log("oncontextmenu");
	//	return false; //may not work on Android due to differences in how touch events are handled.
	//}

	//.first-box figure >>dont fire smh... does for $(window)
	//huh suprising does fire for .photo!
	///>>AHH cause no 'pointer-events : none' css rule
	$('.photo').on('contextmenu', function(e){
		//console.log("contextmenu");
		//e.stopPropagation(); //also needed?!? >>bof dont seem so...
		return false;
	});
	
	let w = $( window ).width();
	//let iw = $( window ).innerWidth(); //huh works with jquery == w above BUT window.innerWidth == d below...huh?
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
	// 'pointerover pointerout' better ? >>seem equivalent...
	//oldie >> 'pointerenter pointerleave'
	const eventType = 'ontouchstart' in window ? 'pointerover pointerout' : 'mouseover mouseout';

	//consoley.log("euuuh"+ w+" "+ d+" "+ h+" "+ hd);
	console.log("euuuh:Sizes", w, d, h, hd,wheelType,eventType); //iw, //'ondragstart' in window == true

	//fires lots ---prolly needed ?!? toReview**
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
				//console.log("activateScroll..?!?",introVisible); //sometimes fires twice...prolly ok?
				window.onscroll = function () {};
			});
	}
	

	function getOffTop(elm){return $(selector).offsetLeft;}
	function printy(elm){
		//let elementTop = $('main').offset().top;
		let offy = $(elm).offset();
		console.log("printy:: "+elm,offy);
		return ;
	}

	function isTouchPointer() { //huh if has coarse pointer...
		return matchMedia("(pointer: coarse)").matches;
	}

	function touchAction() {
		//if ($(".first-box figure").css("touch-action") == "rgb(0, 128, 0)") {}
	
		let fb = $(".first-box figure").css("pointer-events");//touch-action
		//let f = $("figure").css("touch-action"); //when has touch-action css rule
		let t = $("figure").css("pointer-events");
		let b = $(".first-box").css("touch-action");
		let p = $(".photo").css("pointer-events");

		//let m = $("#about").css("touch-action");
		console.log("touch-action",fb,t,b,p); 
		console.log("touch-pointer",isTouchPointer());
		return;
	}

	//true if an element is at the end of its scroll, false if it isn't. >>going down
	function isAtEnd(element){
		//console.log("isAtEnd","scrollHeight="+ element.scrollHeight,"scTop="+element.scrollTop,"clientHeight="+element.clientHeight); //scrollTop == 0 always?
		return element.scrollHeight - element.scrollTop === element.clientHeight;
	}

	let lastKnownScrollPosition = 0;
	
	// Handle both touch and mouse interactions.
	//$('div').on('pointerdown', '#arrow',function(e) { //dont fire in this form
	$("#arrow").on('pointerdown', function(e) {//touchstart
		//if (event.pointerType === 'touch') { //should use to confirm on touch device? meh no need
		//console.log("arrowCLICK....!!", e.clientY,e.screenY); //'mouse' on desktop, 'touch' on mobile
		//e.preventDefault(); //dont continue with click handler in mobile >>yup!!--still needed?
		toggle3dBlock();
		lastKnownScrollPosition = e.clientY ; //save in case scroll back up with touch

	});

	$( "body" ).on( "keypress", function(event) {
		if (( event.which == 32 )&&(introVisible==true)) { //space-bar smh
			toggle3dBlock(!$('#home-container').hasClass('nav-is-visible'));
		}
	});
	
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
			//event.originalEvent.deltaY<2  // originalEvent wrong value>>see above

			//console.log("Scrolling DOWN:: home-container",visible,deltY,event.deltaY, event.originalEvent.deltaY);
			toggle3dBlock(!visible);

			//transition OR animate? no diff
			$('#logo-container').transition({opacity: 0, scale: 1.1},500);//, function() {
				// Animation complete.
				//console.log("logo-container::animate DOWN complete");
			  //}); 
		}//else{console.log("Scrolling DOWN..NOPE",visible, deltaY,event.deltaY, wheelType, event.originalEvent.deltaY, window.scrollY);}
	});
	//ball.ondragstart = () => false; >>to Prevent native drag’n’drop from happening--works for mouse events
	 //umm pointercancel >>helps when doing pointermove--but causes single click as thrown when scrolling interrupts and pointerup not received!
	let lastEventType;
	$('#home-container').on('pointerdown pointermove pointerup', function (event) {
		if (lastEventType == event.type) { //handle pointermove extra firing
			//console.log("home-container >>>DOWNing::SAME",event.type,event.pointerType,event.clientY,event.pageY);
			return ; //add false? >>meh moot..first pointermove is what does toggle...
		}
		lastEventType = event.type;

		//um would pointerup fire tho with scrolling? >>nope! 
		if ('pointerdown' == event.type) {
			lastKnownScrollPosition = event.clientY ;
			return;
		}
		//avoid start on desktop
		if ('pointermove' == event.type && event.pointerType == 'mouse') {
			console.log("home-container >>>DOWNing::NOPE mouse");
			return; 
		}

		let i = isAtEnd(this);
		let visible = $('#home-container').hasClass('nav-is-visible');
		console.log("home-container >>>DOWNing", i , event.type,event.pointerType, event.clientY,event.pageY); 
		//sometimes doesnt get saved?!? >>OH 'pointercancel' event.clientY == 0 --toFix**
		if (introVisible && i){ //adding i though prolly redundant?
			toggle3dBlock(!visible);
			$('#logo-container').transition({opacity: 0, scale: 1.1},500);
			//umm preventDefault(): ?!? no need prolly...
			lastKnownScrollPosition = event.clientY ; //for when scroll back up with pointer
		}
	});

	touchAction();

	//Scroll up
	//huh for scroll up >> event.deltaY,event.originalEvent.deltaY NOT always exact reverse as for scroll down above
	$('main').on(wheelType, function(event) { //wheelType //oldie >> 'mousewheel'
		//event.preventDefault(); // Prevent user scroll during page jump --nah
		let visible = $('main').hasClass('nav-is-visible');
		let deltaY = wheelType == "wheel" ? event.originalEvent.deltaY < 0 : event.deltaY > 0
		if ( (deltaY)&&(introVisible==false)&&(window.scrollY==0) ){ //window.scrollY is how far main is from top and should be 0!
			//let visible = $('main').hasClass('nav-is-visible');
			//(event.deltaY>0)

			//console.log("Scrolling UP::main>> "+wheelType,visible,deltaY, event.deltaY,event.clientY,event.originalEvent.deltaY);
			
			toggle3dBlock(!visible);

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',   
			function(e) {
				//console.log("window::main Scrolling up..."+wheelType,visible, introVisible,event.originalEvent.deltaY, event.deltaY,window.scrollY);
				window.onscroll = function () { window.scrollTo(0, 0); };
			});

			$('#logo-container').transition({opacity: 1, scale: 1, delay:100},500);//,function() {
				// Animation complete.
				//console.log("logo-container::transition UP complete");
			  //});
		}//else{console.log("Scrolling UP..NOPE",visible, introVisible,deltaY,event.deltaY,window.scrollY,event.originalEvent.deltaY);}
	});
	let deltaY = 0;
	let lastMainEventType;
	
	$('main').on('pointerdown pointermove pointerup', function (event) { // bon not handling 'pointercancel' and muck up pointermove
		//event.preventDefault(); // Prevents unwanted scrolls or zooms ...umm still last to handle pointer event...gotta prevent native drag&drop with ondragstart = false + touch-action css..
		if(event.target.tagName == 'FIGURE'){ //skip figures...fires lots for mousemouse...
			//console.log("main >>>UP::NOPE figure", event.pointerId,event.type,event.clientY,event.pageY,lastKnownScrollPosition);
			return; //should return false?@? especially for mouse?
		}
		
		//to handle pointermove firing too much
		if (lastMainEventType == event.type) {
			//console.log("main >>>UPPing::SAME event!!",event.pointerId,event.type,event.clientY,event.pageY,lastKnownScrollPosition);
			//umm should update lastKnownScrollPosition ? >> updates on first event...toReview**
			return;
		}
		lastMainEventType = event.type;

		if ('pointerdown' == event.type) {
			//let bout = $('#about');
			//const aboutElement = document.getElementById("about");aboutElement.setPointerCapture() >>toTest**
			
			//printy('#photo-container'); //toTest if can determine y position click for comparison >>meh not helpful
			//console.log("main >>>UP>>pointerdown",lastKnownScrollPosition,event.clientY,window.scrollY,event.pageY,event.currentTarget.tagName, event.target.tagName);//$('main').scrollTop(),$('#home-container').scrollTop(),$('#photo-container').scrollTop());//,bout.hasPointerCapture(event.pointerId)); >> need to use .querySelector 
			//$(bout).css('touch-action', 'none'); //umm bad as cant scroll no more...use pan-y? toTry**
			//or pointer-events: none;
			//$(bout).setPointerCapture(event.pointerId); //umm works?! >>nope gotta use >>container.querySelector('main') OR .getElementById() above prolly?
			//lastKnownScrollPosition = event.clientY; //umm bad for pointermove? toSee**
			return; //bon stops one click at least
		}

		//check if lastKnownScrollPosition has changed 'fore continue to prevent second click doing stuff...
		// --toReview**
		//if (lastKnownScrollPosition == event.clientY){ //add window.scrollY too? toSee**
		//	console.log("main >>>UPsss>>NOCHANGE!!!", event.type, lastKnownScrollPosition,window.scrollY);
		//	return
		//}

		if ('pointermove' == event.type) {
			console.log("main >>>UPpy>>pointermove",event.pointerId,lastKnownScrollPosition,event.clientY,window.scrollY);
			lastKnownScrollPosition = event.clientY; // update
			return;
		}

		//to just confirm event on figure for android and NOT do scrolling on second pointerup when on figure...
		// caused by addin pointer-events: none; css rule which bypass check above as no pointer event fires from Figure smh
		let onPhotoBox = $(event.target).hasClass('first-box') || $(event.target).hasClass('second-box') || $(event.target).hasClass('third-box');
		if (onPhotoBox){
			//console.log("main >>>UP::NOPEYY figure", event.pointerId,event.type,event.clientY,event.pageY,lastKnownScrollPosition);
			return; 
		}

		let visible = $('main').hasClass('nav-is-visible');

		//let a = $("main")[0].getBoundingClientRect();
		let b = this.getBoundingClientRect(); //equivalent to above
		//let offy = this.offset().top; //nope dont exist?!? >>below works tho...cause grabbing section?>>OH prolly cause using 'this' (works otherwise!!)
		//let elementTop = $('#about').offset().top;
		//printy('#about');
		//printy('main');

		let oldy = lastKnownScrollPosition;
		deltaY =  $(window).scrollTop() - lastKnownScrollPosition; 
		lastKnownScrollPosition = $(window).scrollTop();
		
		console.log("main::GOINnnn UP!! "+event.pointerId +" :: "+onPhotoBox ,oldy, deltaY,$('main').scrollTop(),b.top,$(window).scrollTop(),event.clientY);//,event.originalEvent.defaultPrevented, event.target); //window.scrollY == $(window).scrollTop()
		
		//"scTop="+this.scrollTop, always 0...or only for window? >>seems so
		//"scrollHeight="+ this.scrollHeight,"clientHeight="+this.clientHeight, >>remain the same

		//window.scrollY==0 >>def needed or can jump when later down page...also deltaY >= 0 as calculates to 0 
		if (deltaY >= 0 && introVisible==false && event.type == 'pointerup' && window.scrollY==0) {
			toggle3dBlock(!visible);

			$('main').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
			function(e) {
				//console.log("POINTER Scrolling up...",event.type);//,e.type,lastKnownScrollPosition,introVisible
				window.onscroll = function () { window.scrollTo(0, 0); };
			});

			$('#logo-container').transition({opacity: 1, scale: 1, delay:100},500);//,function() {
				// Animation complete.
				//console.log("logo-container::transition UP complete");
			  //});
		}

	});

	////Refactor of those functions that rotate bckgrd images/////

	// mouseover and mouseout event handler in Desktop OR touch event in mobile
	//'pointerenter pointerleave' better than 'touchstart'
	function handleImageEvent(selector, rotClass, lineSelector, lineClass, elementsToToggle = {}) {
		$(selector).on(eventType, function (e) {  //'mouseover mouseout'
			const shouldAddClass = !$('.photo').hasClass(rotClass);
			const launchyLine = !$(lineSelector).hasClass(lineClass);
			
			//console.log("handleImageEvent....!!"+rotClass,e.type, e.clientY,e.pageY,lastKnownScrollPosition);
			//bof nope for pointer-events
			//if(e.type == 'pointerenter'){
				//$("main").css("pointer-events", "none"); 
				//$("main")[0].style.pointerEvents = "none";
				//e.preventDefault();//bof doesnt work 
			//} else{
				//console.log("handleImageEvent:keepGoing",rotClass,e.type);
				//$("main").css("pointer-events", "auto");
				//$("main")[0].style.pointerEvents = "auto";
			//}  
			//$('main').css('pointer-events', 'none') : $('main').css('pointer-events', 'auto'); >> stops pointerDown triggers on main? >>bof nope...
			//$('#about').css('pointer-events', 'none');
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
		// BUT prolly contribute to ugly rotation...
		// toReview** specially for image02 and image03
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

	//Use jquery instead of document.getElementById? >>meh
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
					//alert("Sent"); //or also set innerHTML as below instead of alert?!?
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