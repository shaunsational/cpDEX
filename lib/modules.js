import { Pokemon as pokemon } from './pokemon.js';
import { Events as events } from './events.js';
import { Regionals as regionals } from './regionals.js';
import { Types as types } from './types.js';
import { Weather as weather } from './weather.js';

import { Autocomplete } from './autocomplete.js';
import { Panels } from './panels.js';
import { Sidebar } from './sidebar.js';


async function fetchJSON(url) {
	return fetch(url)
		.then(response => response.json())
		.catch((error) => {
			console.log(error);
		});
}

function isDay() {
	let h = new Date().getHours();
	return (h >= 8 && h <= 20);
}

function loadMsg(text, data) {
	console.log(
		"%cⓘ%c cpDEX "+ text + " module loaded",
		"color: deepskyblue; font: normal 14px/1.5rem calibri;",
		"color: white; font: italic 14px/1.5rem calibri; padding: 3px;",
		data
	);
}

class PokeDex {
	constructor(dex) {
		this.path = 'pokemon';
		this.simpleDex = {};
		this.regionLocked = {};
	}

	async load() {
		this.types = await fetchJSON('./data/types.json');
		this.entries = await fetchJSON('./data/pokedex.json');

		let pokemon = Object.entries(this.entries);
		let progress = document.querySelector('#preload progress');
		progress.max = pokemon.length;
		for (let [id, mon] of pokemon) {
			progress.value++;
			this.simpleDex[id] = {id: id, name: mon.name};

			if (mon.hasOwnProperty('region')) {
				this.regionLocked[id] = mon;
			}
		}
	}

	simple() {
		return this.simpleDex;
	}

	find(id) {
		return this.entries[id] || false;
	}

	regionals() {
		return this.regionLocked;
	}
}
let Dex = new PokeDex;

let Panel = new Panels();
Panel.classes.set('types', types);
Panel.classes.set('weather', weather);
Panel.classes.set('regionals', regionals);
Panel.classes.set(Dex.path, pokemon);

export { Autocomplete, Dex, Panel, Sidebar, fetchJSON, isDay, loadMsg }