import { loadMsg } from './modules.js';

export class Weather {
	constructor(path) {
		this.build(document.querySelector('#weather'), path);
	}

	// TODO - FIX SIZES OF SVGS ON TYPE BADGES
	build(field, path) {
		let html = '';
		html += '<div><i class="weather sunny"></i><i class="weather clear"></i><br/>Sunny / Clear</div>';
		html += '<div data-type="clear">'+ this.type('fire') + this.type('grass') + this.type('ground') +'</div>';

		html += '<div><i class="weather partly-cloudy"></i><br/>Partly Cloudy</div>';
		html += '<div data-type="partly-cloudy">'+ this.type('normal') + this.type('rock') +'</div>';

		html += '<div><i class="weather cloudy"></i><br/>Cloudy</div>';
		html += '<div data-type="cloudy">'+ this.type('fairy') + this.type('fighting') + this.type('poison') +'</div>';

		html += '<div><i class="weather rain"></i><br/>Rain</div>';
		html += '<div data-type="rain">'+ this.type('bug') + this.type('electric') + this.type('water') +'</div>';

		html += '<div><i class="weather snow"></i><br/>Snow</div>';
		html += '<div data-type="snow">'+ this.type('ice') + this.type('steel') +'</div>';

		html += '<div><i class="weather fog"></i><br/>Foggy</div>';
		html += '<div data-type="fog">'+ this.type('dark') + this.type('ghost') +'</div>';

		html += '<div><i class="weather windy"></i><br/>Windy</div>';
		html += '<div data-type="windy">'+ this.type('dragon') + this.type('flying') + this.type('psychic') +'</div>';

		field.innerHTML += '<div class="weather-grid">'+ html +'</div>';

		loadMsg('Weather System', path);
	}

	type(type) {
		return `<span class="type"><i class="${type}"></i><br />${type[0].toUpperCase() + type.slice(1)}</span>`;
	}
};