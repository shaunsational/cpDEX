const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function delegate_event(event_type, ancestor_element, target_element_selector, listener_function) {
	ancestor_element.addEventListener(event_type, function(event) {
		if (event.target && event.target.matches && event.target.matches(target_element_selector)) {
			(listener_function)(event);
		}
	});
}

function changePanel(hash) {
	let root = hash.split('/');
	
	$$('.nav-link').forEach(a => {a.classList.remove('active');});
	$('.nav-link[href^="'+hash+'"]').classList.add('active');

	$$('main article').forEach(a => {a.classList.remove('active');});
	$('main article#'+root[1]).classList.add('active');
}

(async () => {
	/* feather:false */
	$('#burgerHolder').addEventListener('click', function(e){
		this.classList.toggle('open');
		document.body.classList.toggle('show-sidebar')
	});

	feather.replace({ 'aria-hidden': 'true' });
	
	delegate_event('click', document, 'a[href^="#/"]', function(e){ 		
		if (e.target.rel == 'modal') {
			let modal = e.target.hash.substr(2);
			$(`#${modal}`).showModal();
		} else {
			changePanel(e.target.hash);
		}
		//setPanel(e.target.hash); 
	});	
})();

import iCal from "https://unpkg.com/ical.js/dist/ical.min.js";
try {


	let response = await fetch('https://calendar.google.com/calendar/ical/c_8db5d62ebb83f1abe411ab100ce8875969643c658c4a6522a279d01d68e31a66%40group.calendar.google.com/public/basic.ics');
	console.log(response);
	if (response.ok) { // if HTTP-status is 200-299
		// get the response body (the method explained below)
		let json = await response.json();
		console.log(json);
	} else {
		alert("HTTP-Error: " + response.status);
	}	
} catch (error) {
	console.error(error);
	// Expected output: ReferenceError: nonExistentFunction is not defined
	// (Note: the exact output may be browser-dependent)
}
