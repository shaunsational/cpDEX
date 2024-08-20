import { loadMsg } from './modules.js';

export class Regionals {
	constructor(path) {
		this.element = document.querySelector('#regionals');

		let regionals = new Map();
		regionals.set("Farfetch'd", {id: 83, location:"South Korea, Taiwan, Japan, and Hong Kong"});
		regionals.set("Kangaskhan", {id: 115, location:"Australia"});
		regionals.set("Mr. Mime", {id: 122, location:"Europe"});
		regionals.set("Tauros", {id: 128, location:"The United States and Southern Canada"});
		regionals.set("Heracross", {id: 214, location:"Central and Southern American Regions"});
		regionals.set("Corsola", {id: 222, location:"Between 31N and 26S Latitudes (Coastal Regions only)"});
		regionals.set("Volbeat", {id: 313, location:"Europe, Asia, and Australia"});
		regionals.set("Illumise", {id: 314, location:"North and South Americas and Africa"});
		regionals.set("Torkoal", {id: 324, location:"Western Asian and South-Eastern Asian Regions"});
		regionals.set("Zangoose", {id: 335, location:"Europe, Asia, and Australia"});
		regionals.set("Seviper", {id: 336, location:"North and South Americas and Africa"});
		regionals.set("Lunatone", {id: 337, location:"West of Greenwich Meridian Line"});
		regionals.set("Solrock", {id: 338, location:"East of Greenwich Meridian Line"});
		regionals.set("Tropius", {id: 357, location:"African and Middle-eastern Regions"});
		regionals.set("Relicanth", {id: 369, location:"New Zealand and Oceania"});
		regionals.set("Pachirisu", {id: 417, location:"Arctic Hemisphere Regions(Parts of Canada, Alaska, and Russia)"});
		regionals.set("Chatot", {id: 441, location:"Southern Hemisphere"});
		regionals.set("Carnivine", {id: 455, location:"Southeastern United States"});
		regionals.set("Shellos (West Sea)", {id: 422, location:"Western Hemisphere"});
		regionals.set("Shellos (East Sea)", {id: 422, location:"Eastern Hemisphere"});
		regionals.set("Mime Jr.", {id: 439, location:"Europe (in 5 km eggs)"});
		regionals.set("Uxie", {id: 480, location:"Asia-Pacific"});
		regionals.set("Mesprit", {id: 481, location:"Europe, Middle East, Asia and Africa"});
		regionals.set("Azelf", {id: 482, location:"North and South Americas and Greenland"});
		regionals.set("Pansage", {id: 511, location:"Asia-Pacific Region"});
		regionals.set("Pansear", {id: 513, location:"Europe, Middle East, Africa and India"});
		regionals.set("Panpour", {id: 515, location:"North and South Americas, and Greenland"});
		regionals.set("Throh", {id: 538, location:"North and South Americas, and Africa"});
		regionals.set("Sawk", {id: 539, location:"Europe, Asia and Australia"});
		regionals.set("Basculin (Blue Stripe)", {id: 550, location:"Western Hemisphere"});
		regionals.set("Basculin (Red Stripe)", {id: 550, location:"Eastern Hemisphere"});
		regionals.set("Maractus", {id: 556, location:"Mexico, Central America and South America"});
		regionals.set("Sigilyph", {id: 561, location:"Egypt and Greece"});
		regionals.set("Bouffalant", {id: 626, location:"New York and surrounding areas"});
		regionals.set("Heatmor", {id: 631, location:"Europe, Asia and Australia"});
		regionals.set("Durant", {id: 632, location:"North and South America and Africa"});
		regionals.set("Klefki", {id: 707, location:"France, Luxembourg, UK South East Coast, Western Switzerland"});
		regionals.set("Oricorio (Baile)", {id: 741, location:"Europe, the Middle East, and Africa"});
		regionals.set("Oricorio (Pom-Pom)", {id: 741, location:"North & South America"});
		regionals.set("Oricorio (Pa'u)", {id: 741, location:"African, Asian, Pacific and Caribbean Islands"});
		regionals.set("Oricorio (Sensu)", {id: 741, location:"Asia-Pacific Region"});
		regionals.set("Furfrou (Debutante)", {id: 676, location:"North & South America"});
		regionals.set("Furfrou (Diamond)", {id: 676, location:"Europe, the Middle East, and Africa"});
		regionals.set("Furfrou (Star)", {id: 676, location:"Asia-Pacific Region"});
		regionals.set("Furfrou (La Reine)", {id: 676, location:"France"});
		regionals.set("Furfrou (Kabuki)", {id: 676, location:"Japan"});
		regionals.set("Furfrou (Pharaoh)", {id: 676, location:"Egypt"});
		regionals.set("Comfey", {id: 764, location:"Hawaii"});
		regionals.set("Flabebe (Red Flower)", {id: 669, location:"Europe, the Middle East, and Africa"});
		regionals.set("Flabebe (Yellow Flower)", {id: 669, location:"North & South America"});
		regionals.set("Flabebe (Blue Flower)", {id: 669, location:"Asia-Pacific Region"});
		regionals.set("Hawlucha", {id: 701, location:"Mexico"});
		regionals.set("Celesteela", {id: 797, location:"Southern Hemisphere"});
		regionals.set("Kartana", {id: 798, location:"Northern Hemisphere"});
		// Patterns vary from region, Scatterbug encounters unlocked from pinning postcards sent from their specific region
		regionals.set("Vivillon", {id: 666, location:"Pinning Postcards, check map for Specifics"});
		regionals.set("Stakataka", {id: 805, location:"Eastern Hemisphere"});
		regionals.set("Blacephalon", {id: 806, location:"Western Hemisphere"});

		regionals.forEach((mon, name)=>{
			mon.name = name;
			this.card(mon);
		})

		loadMsg('Regional Pokémon', path);
	}

	card(mon) {
		let card = '';
		let bg = ''; 
		/*
		bg=` style="background-image: url(./sprites/${mon.id}.png); padding-left: 90px;"`;
		/*/
		card += `<img src="./sprites/${mon.id}.png" width="45" height="45" />`;//*/
		card += `<span><span class="name"><span class="id">#${mon.id.toString().padStart(3, '0')}</span> ${mon.name}</span><span class="location">${mon.location}</span></span>`;
		this.element.innerHTML += `<a href="#/dex/${mon.id}" class="monCard"${bg}>${card}</div>`;
	}
};