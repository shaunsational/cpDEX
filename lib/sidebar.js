export class Sidebar {
	constructor(dex) {
		let pokedex = document.querySelector('#pokedex');

		for (var id in dex) {
			let region = this.getRegion(id);
			let a = document.createElement('a');
				a.setAttribute('class', 'nav-link');
				a.setAttribute('href', '#/dex/' + id);
				a.innerHTML = `${this.icon(id)} ${dex[id].name}`;
			let li = document.createElement('li');
				li.setAttribute('class', region +' nav-item');
				li.appendChild(a);
			document.querySelector('#'+ region +'Dex').appendChild(li);
		}
	}

	getRegion(id) {
		if (id <= 151) { return 'kanto'; }
		if (id <= 251) { return 'johto'; }
		if (id <= 386) { return 'hoenn'; }
		if (id <= 493) { return 'sinnoh'; }
		if (id <= 649) { return 'unova'; }
		if (id <= 721) { return 'kalos'; }
		if (id <= 809) { return 'alola'; }
		if (id <= 904) { return 'galar'; }
		if (id <= 1008) { return 'paldea'; }
		return 'unknown';
	}

	icon(id) {
		return `<span class="dexId"><span data-feather="hash" class="align-text-bottom"></span>${id.padStart(3, '0')}</span>`;
	}
}