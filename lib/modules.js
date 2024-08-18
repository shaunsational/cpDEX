import { Dex as dex } from './dex.js';
import { Events as events } from './events.js';
import { Regionals as regionals } from './regionals.js';
import { Types as types } from './types.js';
import { Weather as weather } from './weather.js';

const classes = { dex, events, regionals, types, weather };

function panelClass(name) {
	return classes[name];
}

import { Autocomplete } from './autocomplete.js';
import { Sidebar } from './sidebar.js';

async function fetchJSON(url) {
	return fetch(url)
		.then(response => response.json())
		.catch((error) => {
			console.log(error);
		});
}

function loadMsg(text, data) {
	console.log(
		"%cⓘ%c cpDEX "+ text + " module loaded",
		"color: deepskyblue; font: normal 14px/1.5rem calibri;",
		"color: white; font: italic 14px/1.5rem calibri; padding: 3px;",
		data
	);
}

export { panelClass, Autocomplete, Sidebar, fetchJSON, loadMsg }