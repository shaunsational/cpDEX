import { loadMsg } from './modules.js';

export class Codes {
	constructor(path) {
		this.codes = new Map();

		this.codes.set('A6NEWU63K9AU8', '2024 Worlds avatar T-shirt');
		this.codes.set('FENDIxFRGMTxPOKEMON', 'FENDIxFRGMTxPOKEMON avatar hoodie');
		this.codes.set('GOFEST2024', 'Use in the web store with purchase for a Free Premium Battle Pass and an Incubator');
		this.build(document.querySelector('#codes'), path);
	}

	// TODO - FIX SIZES OF SVGS ON TYPE BADGES
	build(field, path) {
		let html = '<p>Clicking on a code will open a window to the Niantic redemption page.</p>';

		for (const [code, item] of this.codes) {
			html += `<dl><dt><a href="https://store.pokemongolive.com/offer-redemption?passcode=${code}" target="_new">${code}</a></dt><dd>${item}</dd></dl>\n`;
		}

		field.innerHTML += '<div class="promo-codes">'+ html +'</div>';

		loadMsg('Promo Code', path);
	}

	type(type) {
		return `<span class="type"><i class="${type}"></i><br />${type[0].toUpperCase() + type.slice(1)}</span>`;
	}
};