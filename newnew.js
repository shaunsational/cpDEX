import { Autocomplete, Sidebar, fetchJSON, panelClass } from './lib/modules.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

function delegate_event(event_type, ancestor_element, target_element_selector, listener_function) {
	ancestor_element.addEventListener(event_type, function(event) {
		if (event.target && event.target.matches && event.target.matches(target_element_selector)) {
			(listener_function)(event);
		}
	});
}

class Panels {
	constructor() {
		this.loaded = [];
		this.classes = new Map();
	}

	load(hash) {
		let path = hash.split('/'), 
			panel = path[1];

		if (this.loaded.includes(panel)) {
			if (panel == 'dex') {
				this.classes.get('dex').updateMon(dex[path[2]]);
			}
			this.updateNav(path);
			return true;
		}

		try {
			const loader = panelClass(panel);
			let loaded = new loader(path);

			if (loaded != false) {
				this.loaded.push(panel);
				this.classes.set(panel, loaded);
				this.updateNav(path);
				if (panel == 'dex') {
					loaded.updateMon(dex[path[2]])
				}
				return true;
			}
			throw new TypeError('Panel method doesn\'t exist or is returning false');
			return false;
		} 
		catch(err) {
			console.error('Panel method doesn\'t exist:', panel, err);
		}
	}

	updateNav(path) {
		document.body.classList.remove('show-sidebar');
		$$('.nav-link').forEach(a => {a.classList.remove('active');});
		$('.nav-link[href^="#/'+ path[1] +'"]').classList.add('active');

		if (path[1] == 'dex')
		try { $('.pokedex-links .nav-link[href="'+ path.join('/') +'"]').classList.add('active'); } 
		catch(err) { console.error('Couldn\'t highlight nav link: ', path.join('/'), err); }

		$$('main article').forEach(a => {a.classList.remove('active');});
		$('main article#'+ path[1] ).classList.add('active');
	}
}
let panels = new Panels();
let dex = await fetchJSON('./data/pokedex.json');

document.addEventListener("DOMContentLoaded", (async () => {
	//var events = await fetchJSON('data/events.json');
	//console.log(events);

	//var dex = await fetchJSON('./data/pokedex.json');
	new Sidebar(dex);

	panels.load(window.location.hash || '#/types');

	/* feather:false */
	$('#burgerHolder').addEventListener('click', function(e){
		this.classList.toggle('open');
		document.body.classList.toggle('show-sidebar');
	});

	feather.replace({ 'aria-hidden': 'true' });
	
	delegate_event('click', $('.pokedex-links'), 'em', function(e){
		e.target.classList.toggle('open');
		e.target.nextElementSibling.toggleAttribute('hidden');
	});

	delegate_event('click', document, 'a[href^="#/"]', function(e){
		if (e.target.rel == 'modal') {
			let modal = e.target.hash.substr(2);
			$(`#${modal}`).showModal();
		} else {
			let loaded = e.target.classList.contains('loaded');
			panels.load(e.target.hash);
		}
	});

	const ac = new Autocomplete($('#pokedexSearch'), {
		data: dex,
		maximumItems: 10,
		threshold: 1,
		label: 'name',
		value: 'id',
		searchValue: true,
		onSelectItem: ({label, value}) => {
			$('#pokedexSearch').value = '';
		}
	});
})());