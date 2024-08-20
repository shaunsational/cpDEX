import { fetchJSON, loadMsg } from './modules.js';

const DEFAULTS = {
	headingEl: 'th',
	headingClass: 'header'
};

export class Types {
	constructor(path) {
		this.build(document.querySelector('#types'), {}, path);
	}

	async build(field, options, path) {
		this.field = field;
		this.options = Object.assign({}, DEFAULTS, options);

		this.options.types = await fetchJSON('./data/types.json');
	
		this.table = document.createElement('table');
		this.table.className = 'type-table';
		this.table.id = 'type-table';

		this.styles = document.createElement('style');
		this.styles.id = 'type-table-css';

		this.rowOpac = '.75'; 
		this.colOpac = '.5';

		let topRow = document.createElement('tr');
		topRow.append ( this.makeCell({el:'th', text:'VS', attrs:{style:"background:linear-gradient(-45deg, #DADADA 50%, transparent 50%)"}}) );
		this.table.append(topRow);
		
		let y = 1;
		for (var t in this.options.types) {
			let type = this.options.types[t];
			topRow.append( this.makeCell({el:'th', text:t, attrs:{order:type.order, 'data-col': t, style: `background: rgba(var(--pokergb-${t}), ${this.colOpac})`}}) );
			
			let x = 1;
			let newRow = document.createElement('tr');
			newRow.setAttribute('order', type.order);
			newRow.setAttribute('data-row', t);
			newRow.append( this.makeCell({el:'th', text:t, attrs:{'data-row': t, style: `background: rgba(var(--pokergb-${t}), ${this.rowOpac})`} }) );
			for (var ct in this.options.types) {
				let cell = this.makeCell({attrs:{"data-row":t, "data-col":ct, "data-x": x, "data-y": y, title:(t +' -vs- '+ ct).toUpperCase()}});
				cell.innerHTML = '&nbsp;';
				for (var d in this.options.types[ct].damage) {
					let rt = this.options.types[t].damage[d];
					if (d == 'none' && rt.includes(ct)) { cell.innerHTML = "🚫"; }
					if (d == 'half' && rt.includes(ct)) { cell.innerHTML = "🔴"; }
					if (d == 'double' && rt.includes(ct)) { cell.innerHTML = "🟢"; }
				}
				x++;
				newRow.append(cell);
			}
			y++;
			this.table.append(newRow);
		}
		
		let legend = this.createElement('<legend><div></div><div>🚫 = No Damage</div><div>🔴 = Half Damage</div><div>🟢 = Double Damage</div></legend>');
		this.field.append(this.table);
		this.field.append(legend);
		this.field.append(this.styles);
		loadMsg('Type Effectiveness', path);
	}

	makeCell(options) {
		let props = {
			text:	'',
			attrs:	{},
			order:	null,
			style:	null,
			el:		'td',
			...options
		};
		props.el = (typeof(props.el) == 'undefined') ? 'td' : props.el;
		
		let el = document.createElement(props.el);
		if (Object.keys(props.attrs).length) {
			Object.entries(props.attrs).forEach(([attr, value]) => {
				el.setAttribute(attr, value);
			});
		}
		el.innerHTML = props.text;
		el.addEventListener('mouseenter', (e) => {
			this.styles.innerHTML = '';
			this.table.setAttribute('data-highlight-row', el.dataset.row);
			this.table.setAttribute('data-highlight-col', el.dataset.col);

			let highlightMod = .2;
			this.styles.innerHTML += '.type-table[data-highlight-row="'+ el.dataset.row +'"] tr td[data-row="'+ el.dataset.row +'"]:nth-of-type(-n+'+ el.dataset.x +') {background: rgba(var(--pokergb-'+ el.dataset.row +'), '+ (this.rowOpac - highlightMod) +');}\n\n';
			this.styles.innerHTML += '.type-table[data-highlight-col="'+ el.dataset.col +'"] tr:nth-of-type(-n+'+ el.dataset.y +') td[data-col="'+ el.dataset.col +'"] {background: rgba(var(--pokergb-'+ el.dataset.col +'), '+ (this.colOpac - highlightMod) +');}\n\n';

			this.styles.innerHTML += '#type-table td[data-row="'+ el.dataset.row +'"][data-col="'+ el.dataset.col +'"] {background: linear-gradient(to top right, rgba(var(--pokergb-'+ el.dataset.row +'), '+ (this.rowOpac - highlightMod) +') 50%, rgba(var(--pokergb-'+ el.dataset.col +'), '+ (this.colOpac - highlightMod) +') 50%);}';
		});
		if (props.el == 'td') {
			el.addEventListener('mouseout', (e) => {
				el.removeAttribute('style');
				this.styles.innerHTML = '';
			});
		}
		return el;
	}
	
	createElement( str ) {
		var frag = document.createElement('div');
		frag.innerHTML = str;
		return frag.firstChild;
	}	
};