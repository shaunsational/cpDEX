import { CONFIG, fetchJSON, isDay, loadMsg, Dex, Panel } from './modules.js';

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export class Pokemon {
	constructor(path) {
		this.cleanSlate(path[1]);
		loadMsg('Pokémon', path);
	}

	getMonTypes(data) {
		let retval = { "types": [], "tags": "", "boost": "" };
		let effect = [], typeEffect = {};
		data.forEach(t => {
			retval.types.push(t);
			retval.tags += `<tag class="${t}">${t}</tag>`;
			let weather = (Dex.types[t].weather != 'clear') ? Dex.types[t].weather : (isDay()) ? 'sunny' : 'clear';
			retval.boost += `<i class="${weather}"></i>`;

			effect.push(Dex.types[t].damage);
		});

		if (effect.length > 0) {
			$('#noEffect').innerHTML = '';
			$('#weakEffect').innerHTML = '';
			$('#strongEffect').innerHTML = '';

			effect.forEach(mt => {
				mt.none.forEach(t => {
					if (!typeEffect.hasOwnProperty(t)) { typeEffect[t] = 1; }
					typeEffect[t] -= 1;
				})
				mt.half.forEach(t => {
					if (!typeEffect.hasOwnProperty(t)) { typeEffect[t] = 1; }
					typeEffect[t] = typeEffect[t] * .5;
				})
				mt.double.forEach(t => {
					if (!typeEffect.hasOwnProperty(t)) { typeEffect[t] = 1; }
					typeEffect[t] = typeEffect[t] * 2;
				})
			});

			for (let type in typeEffect) {
				let damage = typeEffect[type];
				if (damage < 0) { $('#noEffect').innerHTML += `<tag class="${type}">${type}</tag>`; }
				if (damage < 1) { $('#weakEffect').innerHTML += `<tag class="${type}">${type}</tag>`; }
				if (damage > 1) { $('#strongEffect').innerHTML += `<tag class="${type}">${type}</tag>`; }
			};
		}
		return retval;
	}

	megaCard(id) {
		let mon = Dex.find(id);
		if (mon) {
			let card = '<a href="#/pokemon/'+ id +'" class="mega-card" data-name="'+ mon.name +'" data-type="'+ mon.type[0] +'"';
			if (mon.type.length > 1) {
				card += ' data-type2="'+ mon.type[1] +'"';
			}
			card += '><i></i><span>'+ mon.name +'</span></a>';
			return card;
		}
		return '';
	}

	changeForm(id, form="") {
		form = (typeof(id) != "string") ? id.target.value : form;
		id = (typeof(id) == "string") ? id : id.target.dataset.id;

		let mon = Dex.find(id);
		mon = Object.assign({}, mon, mon.forms[form]);
		this.updateMon(mon, form);

		// Should I update location history so it appears correct in URL?
	}

	sprite(id, form, normal, shiny=false) {
		form = (form == normal) ? '' : form;
		form = (id == 201 && form == '!') ? 'exclamation' : form;
		form = (id == 201 && form == '?') ? 'question' : form;
		form = form.replaceAll(' ', '-');
		let imageURL = (form == "") ? id : `${id}-${form.toLowerCase()}`;

		let sprite = $('#pokemon #sprite');
		if (!shiny) {
			sprite.classList.add('no-shiny');
		} else {
			sprite.classList.remove('no-shiny');
		}

		let img = $('#pokemon #sprite img');
		img.src = `./sprites/${imageURL}.png`;
		img.setAttribute('data-sprite', `./sprites/${imageURL}.png`);
		img.setAttribute('data-shiny', `./sprites/shiny/${imageURL}.png`);
	}

	updateMon(mon, currentForm="") {
		if (currentForm == '' && mon.hasOwnProperty('default')) { mon = Object.assign({}, mon, mon.forms[mon.default]); currentForm = mon.default; }
		if (!mon.hasOwnProperty('cp_range')) {mon.cp_range = CONFIG.fake_cps}
		if (typeof(mon.cp_range) == 'string') {mon.cp_range = mon.forms[mon.cp_range].cp_range}
		if (currentForm == "Mega" || currentForm.startsWith('Gigantamax')) { 
			$('#pokemon').classList.add('mega'); } else { $('#pokemon').classList.remove('mega'); 
		}

		let monTypes = this.getMonTypes(mon.type);

		$('#pokemon .banner').style.background = 'linear-gradient(to bottom, rgba(var(--pokergb-'+ mon.type[0] +'),.35), rgba(var(--bs-body-bg-rgb),.75)) #FFF';
		$('.banner #currentForm').innerHTML = '';
		if (mon.hasOwnProperty('forms') && Object.keys(mon.forms).length > 1) {
			$('.banner #currentForm').setAttribute('data-id', mon.id);
			$('.banner #currentForm').addEventListener('change', this.changeForm.bind(this), {once:true});
			for (var form in mon.forms) {
				let selected = (form == currentForm || (currentForm == "" && form == mon.default)) ? ' selected="selected"' : '';
				$('.banner #currentForm').innerHTML += `<option value="${form}"${selected}>${form}</option>`;
			}
		}

		$('#mon-name').innerHTML = '<span class="mon-name"></span><span class="types">'+ monTypes.tags +'</span>';
		$$('.mon-name').forEach((el, i) => {
			let dexID = (i == 0) ? `<span class="dexID">#${mon.id.toString().padStart(3,'0')}</span>` : '';
			el.innerHTML = `${dexID}${mon.name}`;
		});

		$('#pokenotes').innerHTML = '';
		if (mon.hasOwnProperty('released') && !mon.released) {
			this.pokeNote('slash', `<strong>${mon.name}</strong> has not been released in Pokémon GO yet.`, 'not-released');
		}
		if (mon.hasOwnProperty('pokenote')) {
			this.pokeNote('alert-triangle', mon.pokenote, 'warning');
		}
		if (mon.hasOwnProperty('region')) {
			this.pokeNote('globe', `This regional pokémon can be found in <span id="region">${mon.region}</span>, and/or possibly during special events.`, 'regional');
		} else if (mon.hasOwnProperty('family')) {
			let evo = Dex.isRegional(mon.family, currentForm);
			if (evo !== false) {
				this.pokeNote('globe', `This pokémon evolves from <a href="#/${Dex.path}/${mon.family}/${evo.form}">${evo.name} (${evo.form})</a> which can be found in <span id="region">${evo.region}</span>, and/or possibly during special events.`, 'regional');
			}
		}

		$('#pokemon #sprite').classList.remove('shiny');
		this.sprite(mon.id, currentForm, mon.default, mon.shiny);

		$('#megas').innerHTML = '';
		let buddies = {};
		mon.type.forEach(t => {
			Object.entries(Dex.types[t].megas).forEach(([id, name]) => {
				buddies[id] = name;
			});
		});
		for (var id in buddies) {
			$('#megas').innerHTML += this.megaCard(id);
		}

		let levels = [], c2 = 0, c5 = 0;
		for (let i = 0; i < mon.cp_range.length; i++) {
			if (i+1 == CONFIG.levelFrom.research) { // FIELD RESEARCH
				$('#apb .research').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP';
			} 
			if (i+1 == CONFIG.levelFrom.raid) { // HATCHED / RAID
				$('#apb .hatched').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP';
				$('#apb .raid').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP';
			}
			if (i+1 == CONFIG.levelFrom.raidWeather) { // RAID WEATHER
				$('#apb .raid-w').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP<span class="boost">' + monTypes.boost +'</span>';
			}
			if (i+1 == CONFIG.levelFrom.wild) { // WILD
				$('#apb .wild').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP';
			}
			if (i+1 == CONFIG.levelFrom.wildWeather) { // WILD WEATHER
				$('#apb .wild-w').innerHTML = '<i class="activity"></i><span class="cp">'+ mon.cp_range[i].max +'</span>CP<span class="boost">' + monTypes.boost +'</span>';
			}

			let order = (window.innerWidth > 700) ? (5*(i%10) + c5) : (2*(i%25) + c2);
			levels.push(`<div style="order: ${order}" data-order-x1="${i+1}" data-order-x2="${2*(i%25) + c2}" data-order-x5="${5*(i%10) + c5}"><span class="level">${mon.cp_range[i].level}</span><span class="min">${mon.cp_range[i].min}</span><span class="max">${mon.cp_range[i].max}</span></div>`);

			if (i % 25 == 0) {c2++;}
			if (i % 10 == 0) {c5++;}
		}
		$('#grid-table').innerHTML = levels.join('');
		feather.replace({ 'aria-hidden': 'true' });
	}

	pokeNote(icon, html, css="") {
		$('#pokenotes').innerHTML += `<div class="pokenote${(css!='')? ' '+css:''}"><span data-feather="${icon}"></span><p>${html}</p></div>`;
	}

	cleanSlate(el) {
		let slate = document.querySelector('#'+ el);
		slate.innerHTML = ''+
		'<div class="banner">This pokemon has different forms, you are currently viewing the <select id="currentForm"></select> variant.</div>'+
		'<h1 id="mon-name"></h1>'+

		'<div id="apb" class="mega-hide"><div class="wild"></div><div class="wild-w"></div><div class="research"></div><div class="raid"></div><div class="raid-w"></div><div class="hatched"></div></div>'+
		/*
		<p>Field and Special Research encounters are always Level 15. IVs range from 10 (min) to 15 (max). Field Research encounters have a 10/10/10 IV floor.</p>
		<p>Pokémon hatched from Eggs are always Level 20. IVs range from 10 (min) to 15 (max). Egg Hatches have a 10/10/10 IV floor.</p>
		<p>Raid Bosses caught without weather boost are always Level 20. IVs range from 10 (min) to 15 (max). Raid Catches have a 10/10/10 IV floor.</p>
		<p>Raid Bosses caught with weather boost are always Level 25. IVs range from 10 (min) to 15 (max). Weather boosted Raid Catches have a 10/10/10 IV floor.</p>
		<p>😈 Shadow Pokémon have 6/6/6 IV floor in raids.</p>
		<p>Wild encounters range from Level 1 to Level 30 Pokémon. Their IVs range from 0 (min) to 15 (max) for each stat.</p>
		<p>Weather Boosted wild Pokémon encounters get a 5 Level boost, bringing their Level range to Level 6 to Level 35. In addition, they have a guaraneed minimum IV value of 4 for each stat, resulting in a 4/4/4 IV floor.</p>
		<!-- TODO add level specific items and use the above info as a modal for more info -->		
		*/

		'<div id="pokenotes"></div>'+

		'<div id="look-stats">'+
			'<h3>Sprite</h3>'+
			'<h3>Type Effectiveness</h3>'+

			'<div id="sprite">'+
				'<img src="" onerror="this.src=\'./sprites/0.png\'" />'+
				'<svg class="shiny-toggle" viewBox="0 0 644.435 644.429" xmlns="http://www.w3.org/2000/svg"><path id="_x23_C62032" d="M 451.879 418.122 C 355.109 411.327 249.417 365.936 236.732 208.845 C 224.049 365.936 135.421 411.327 38.649 418.122 C 135.421 424.915 224.049 470.299 236.732 627.39 C 249.417 470.299 355.109 424.915 451.879 418.122 Z" style="fill: currentColor;"/><path id="path-1" d="M 586.544 218.043 C 518.602 213.274 444.396 181.406 435.493 71.115 C 426.587 181.406 364.362 213.275 296.42 218.043 C 364.362 222.814 426.587 254.678 435.493 364.969 C 444.396 254.678 518.602 222.814 586.544 218.043 Z" style="fill: currentColor;"/><path id="path-2" d="M 292.394 131.06 C 234.977 127.029 172.268 100.097 164.745 6.896 C 157.22 100.097 104.635 127.031 47.22 131.06 C 104.635 135.092 157.22 162.018 164.745 255.221 C 172.268 162.018 234.977 135.092 292.394 131.06 Z" style="fill: currentColor;"/></svg>'+
				'<select></select>'+
			'</div>'+

			'<div class="effectiveness types">'+
				'<dl><dt>Strong Against</dt><dd id="strongEffect"></dd></dl>'+
				'<dl><dt>Weak Against</dt><dd id="weakEffect"></dd></dl>'+
				'<dl><dt>No Effect On</dt><dd id="noEffect"></dd></dl>'+
			'</div>'+
		'</div>'+

		'<div class="mega-hide">'+
			'<h3 data-collapse="true" class="hide">Mega/Primal Buddies</h3>'+
			'<div class="mega-buddies">'+
				'<p>Depending on your mega level for the following, you will get extra rewards while catching <span class="mon-name"></span>.</p>'+
				'<div id="megas"></div>'+
				'<p>You will receive the following bonuses while having them mega evolved (it does NOT have to be your buddy).</p>'+
				'<div id="mega-levels">'+
					'<dl>'+
						'<dt><strong>Level 1</strong><p>1 evolution required</p></dt>'+
						'<dd data-cooldown="7"><p>Friend Attack Boost * 1.1</p><p>Same Type Attack Boost * 1.3</p><p>1 Bonus Catch Candy†</p></dd>'+
					'</dl>'+
					'<dl>'+
						'<dt><strong>Level 2</strong><p>7 evolutions required</p></dt>'+
						'<dd data-cooldown="5"><p>Friend Attack Boost * 1.1</p><p>Same Type Attack Boost * 1.3</p><p>1 Bonus Catch Candy†</p><p>50 Bonus Catch XP†</p><p>10% Boost to XL Candy Chance†</p></dd>'+
					'</dl>'+
					'<dl>'+
						'<dt><strong>Level 3</strong><p>30 evolutions required</p></dt>'+
						'<dd data-cooldown="3"><p>Friend Attack Boost * 1.1</p><p>Same Type Attack Boost * 1.3</p><p>2 Bonus Catch Candy†</p><p>100 Bonus Catch XP†</p><p>25% Boost to XL Candy Chance†</p></dd>'+
					'</dl>'+
				'</div>'+
				'<p>†The catch candy and catch XP bonuses only apply to Pokémon caught of the same type/s as your mega-evolved Pokémon</p>'+
				'<p>Remember, you only have to use the mega energy once per Pokémon, there is a cooldown period until you can mega-evolve it again without mega energy.  The mega-evolution will last for 8 hours which is more than enough time to do a community day or even go-fest for a day.  Each time you mega evolve your Pokémon, you advance its mega level.</p>'+
			'</div>'+
		'</div>'+

		'<h3 data-collapse="true" class="hide">Full CP Chart</h3>'+
		'<div class="cp-chart table-responsive grid-table">'+
			'<aside>'+
				'<div><b>Lvl</b><b>Min</b><b>Max</b></div>'+
				'<div><b>Lvl</b><b>Min</b><b>Max</b></div>'+
				'<div class="x2-hide"><b>Lvl</b><b>Min</b><b>Max</b></div>'+
				'<div class="x2-hide"><b>Lvl</b><b>Min</b><b>Max</b></div>'+
				'<div class="x2-hide"><b>Lvl</b><b>Min</b><b>Max</b></div>'+
			'</aside>'+
			'<article id="grid-table"></article>'+
		'</div>';
		$('#pokemon #sprite').addEventListener('click', this.toggleShiny);
	}

	toggleShiny(e) {
		let sprite = $('#sprite');
		sprite.classList.toggle('shiny');

		let img = $('#sprite img');
		img.src = (sprite.classList.contains('shiny')) ? img.dataset.shiny : img.dataset.sprite;
	}
};