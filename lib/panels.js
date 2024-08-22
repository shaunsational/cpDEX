import { Dex } from './modules.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export class Panels {
	constructor() {
		this.loaded = [];
		this.classes = new Map();
	}

	load(hash) {
		let path = hash.split('/'), 
			panel = path[1];

		if (this.loaded.includes(panel)) {
			if (panel == Dex.path) {
				this.handleDex(path);
			}
			this.updateNav(path);
			return true;
		}

		try {
			const loader = this.classes.get(panel);
			let loaded = new loader(path);

			if (loaded != false) {
				this.loaded.push(panel);
				this.classes.set(panel, loaded);
				this.updateNav(path);
				if (panel == Dex.path) {
					this.handleDex(path);
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

	handleDex(path) {
		if (path.length > 3) {
			this.classes.get(Dex.path).changeForm(path[2], path[3]);
		} else {
			this.classes.get(Dex.path).updateMon(Dex.find(path[2]));
		}
	}

	updateNav(path) {
		document.body.classList.remove('show-sidebar');
		$$('.nav-link').forEach(a => {a.classList.remove('active');});
		$('.nav-link[href^="#/'+ path[1] +'"]').classList.add('active');

		if (path[1] == Dex.path)

		try {
			let basePath = (path.length > 3) ? path.pop().join('/') : path.join('/');
			let link = $('#pokedex .nav-link[href="'+ basePath +'"]');
			let region = link.closest('ul').previousElementSibling;

			link.classList.add('active');
			region.classList.add('open');
			setTimeout(()=>{
				$('.pokedex-links').scrollTo({top: link.offsetTop - 40, behavior: 'smooth'});
			}, 1);
		} 
		catch(err) { console.error('Couldn\'t highlight nav link: ', path.join('/'), err); }

		$$('main article').forEach(a => {a.classList.remove('active');});
		$('main article#'+ path[1] ).classList.add('active');
	}
}
