import { CONFIG } from './config.js';

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

class loadProgress {
	constructor(el) {
		this.progress = el;
	}

	async get(url, size=0) {
		let data = await this.load(url, size);
		return JSON.parse(data);
	}

	async load(url, size) {
		const response = await fetch(url);
		size = response.headers.get('Content-Length') || size;
		this.progress.max = size;
		const reader = response.body.getReader();
		let receivedLength = 0;
		const chunks = [];
		while (true) {
			const { done, value } = await reader.read();
			if (done) {
				break;
			}
			chunks.push(value);
			receivedLength += value.length;
			this.update(receivedLength);
		}
		const chunksAll = new Uint8Array(receivedLength);
		let position = 0;
		for (let chunk of chunks) {
			chunksAll.set(chunk, position);
			position += chunk.length;
		}
		const result = new TextDecoder("utf-8").decode(chunksAll);
		return result;		
	}

	update(received) {
		this.progress.value = received;
	}
}

class PokeDex {
	constructor(dex) {
		this.path = 'pokemon';
		this.simpleDex = {};
		this.regionLocked = {};
	}

	async load() {
		let getter = await new loadProgress(document.querySelector('#preload progress'));
		await getter.get('./data/types.json', 6314).then(data => {
			this.types = data;
		});

		await getter.get('./data/pokedex.json', 2512252).then(data => {
			this.entries = data;
		});

		let pokemon = Object.entries(this.entries);
		for (let [id, mon] of pokemon) {
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

export { CONFIG, Autocomplete, Dex, Panel, Sidebar, fetchJSON, isDay, loadMsg }