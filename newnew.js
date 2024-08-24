import { Autocomplete, Dex, Panel, Sidebar, fetchJSON } from './lib/modules.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function delegate_event(event_type, ancestor_element, target_element_selector, listener_function) {
	ancestor_element.addEventListener(event_type, function(event) {
		if (event.target && event.target.matches && event.target.matches(target_element_selector)) {
			(listener_function)(event);
		}
	});
}

document.addEventListener("DOMContentLoaded", (async () => {
	await Dex.load()
	new Sidebar(Dex.simple(), Dex.path);

	Panel.load(window.location.hash || '#/types');

	$('#burgerHolder').addEventListener('click', function(e){
		this.classList.toggle('open');
		document.body.classList.toggle('show-sidebar');
	});

	feather.replace({ 'aria-hidden': 'true' });
	
	delegate_event('click', $('.pokedex-links'), 'em', function(e){
		e.target.classList.toggle('open');
	});

	delegate_event('click', document, `#${Dex.path} h3`, function(e){
		e.target.classList.toggle('hide');
	});

	delegate_event('click', document, `#${Dex.path} h3.hide + div`, function(e){
		e.target.previousElementSibling.classList.toggle('hide');
	});

	delegate_event('click', document.body, 'a[href^="#/"]', function(e){
		if (e.target.rel == 'modal') {
			let modal = e.target.hash.substr(2);
			$(`#${modal}`).showModal();
		} else {
			Panel.load(e.target.hash);
		}
	});

	$('#pokemon').addEventListener('click', function(e){
		if (e.target.closest('a[href^="#/"]')) {
			Panel.load(e.target.closest('a[href^="#/"]').hash);
		}
	});

	const ac = new Autocomplete($('#pokedexSearch'), {
		data: Dex.simple(),
		maximumItems: 10,
		threshold: 1,
		label: 'name',
		value: 'id',
		linkPath: Dex.path,
		searchValue: true,
		onSelectItem: ({label, value, target}) => {
			$('#pokedexSearch').value = '';
			target.click();
		}
	});

	$('#preload').classList.add('done');
})());