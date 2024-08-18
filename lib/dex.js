import { loadMsg } from './modules.js';

export class Dex {
	constructor(path) {
		this.buildHTML();
		loadMsg('Pokédex', path);
	}

	updateMon(mon) {
		console.log(mon);
	}

	buildHTML() {
		console.log('making html for dex entry page');
	}
};