import { Dex, loadMsg } from './modules.js';

export class Regionals {
	constructor(path) {
		this.element = document.querySelector('#regionals');

/*
		// Patterns vary from region, Scatterbug encounters unlocked from pinning postcards sent from their specific region
		regionals.set("Vivillon", {id: 666, location:"Pinning Postcards, check map for Specifics"});
		regionals.set("Flabebe (Red Flower)", {id: 669, location:"Europe, the Middle East, and Africa"});
		regionals.set("Flabebe (Yellow Flower)", {id: 669, location:"North & South America"});
		regionals.set("Flabebe (Blue Flower)", {id: 669, location:"Asia-Pacific Region"});
		regionals.set("Furfrou (Debutante)", {id: 676, location:"North & South America"});
		regionals.set("Furfrou (Diamond)", {id: 676, location:"Europe, the Middle East, and Africa"});
		regionals.set("Furfrou (Star)", {id: 676, location:"Asia-Pacific Region"});
		regionals.set("Furfrou (La Reine)", {id: 676, location:"France"});
		regionals.set("Furfrou (Kabuki)", {id: 676, location:"Japan"});
		regionals.set("Furfrou (Pharaoh)", {id: 676, location:"Egypt"});
		regionals.set("Hawlucha", {id: 701, location:"Mexico"});
		regionals.set("Klefki", {id: 707, location:"France, Luxembourg, UK South East Coast, Western Switzerland"});

		regionals.set("Oricorio (Baile)", {id: 741, location:"Europe, the Middle East, and Africa"});
		regionals.set("Oricorio (Pom-Pom)", {id: 741, location:"North & South America"});
		regionals.set("Oricorio (Pa'u)", {id: 741, location:"African, Asian, Pacific and Caribbean Islands"});
		regionals.set("Oricorio (Sensu)", {id: 741, location:"Asia-Pacific Region"});
		regionals.set("Comfey", {id: 764, location:"Hawaii"});
		regionals.set("Celesteela", {id: 797, location:"Southern Hemisphere"});
		regionals.set("Kartana", {id: 798, location:"Northern Hemisphere"});

		regionals.set("Stakataka", {id: 805, location:"Eastern Hemisphere"});
		regionals.set("Blacephalon", {id: 806, location:"Western Hemisphere"});
*/

		//Dex.regionals().forEach((mon, name)=>{
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