import { Dex, loadMsg } from './modules.js';

export class Regionals {
	constructor(path) {
		this.element = document.querySelector('#regionals');

		for (let [id, mon] of Object.entries(Dex.regionals())) {
			let card = '';
			let bg = ''; 
			/*
			bg=` style="background-image: url(./sprites/${mon.id}.png); padding-left: 90px;"`;
			/*/
			card += `<img src="./sprites/${mon.id}.png" width="45" height="45" />`;//*/
			card += `<span><span class="name"><span class="id">#${mon.id.toString().padStart(3, '0')}</span> ${mon.name}</span><span class="location">${mon.region}</span></span>`;
			this.element.innerHTML += `<a href="#/${Dex.path}/${mon.id}" class="monCard"${bg}>${card}</div>`;
		}

		loadMsg('Regional Pokémon', path);
	}
};