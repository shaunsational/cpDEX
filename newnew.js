import { Autocomplete, Dex, Sidebar, fetchJSON, panelClass } from './lib/modules.js';

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
			if (panel == Dex.path) {
				this.classes.get(Dex.path).updateMon(Dex.find(path[2]));
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
				if (panel == Dex.path) {
					loaded.updateMon(Dex.find(path[2]));
				}
				return true;
			}
			throw new TypeError('Panel method doesn\'t exist or is returning false');
			return false;
		} 
		catch(err) {
			console.error('Panel method doesn\'t exist, or is broken:', panel, err);
		}
	}

	updateNav(path) {
		document.body.classList.remove('show-sidebar');
		$$('.nav-link').forEach(a => {a.classList.remove('active');});
		$('.nav-link[href^="#/'+ path[1] +'"]').classList.add('active');

		if (path[1] == Dex.path)
		try { $('.pokedex-links .nav-link[href="'+ path.join('/') +'"]').classList.add('active'); } 
		catch(err) { console.error('Couldn\'t highlight nav link: ', path.join('/'), err); }

		$$('main article').forEach(a => {a.classList.remove('active');});
		$('main article#'+ path[1] ).classList.add('active');
	}
}
let panels = new Panels();

document.addEventListener("DOMContentLoaded", (async () => {
	await Dex.load()
	new Sidebar(Dex.simple(), Dex.path);

	panels.load(window.location.hash || '#/types');

	$('#burgerHolder').addEventListener('click', function(e){
		this.classList.toggle('open');
		document.body.classList.toggle('show-sidebar');
	});

	feather.replace({ 'aria-hidden': 'true' });
	
	delegate_event('click', $('.pokedex-links'), 'em', function(e){
		e.target.classList.toggle('open');
		e.target.nextElementSibling.toggleAttribute('hidden');
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
			panels.load(e.target.hash);
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
		onSelectItem: ({label, value}) => {
			$('#pokedexSearch').value = '';
		}
	});
})());