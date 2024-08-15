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