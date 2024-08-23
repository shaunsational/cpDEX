const CONFIG = { 
	"key": {
		"UP": 38,
		"DOWN": 40,
		"ESC": 27,
		"SELECT": 13
	}
}
const DEFAULTS = {
	threshold: 2,
	maximumItems: 5,
	highlightTyped: true,
	highlightClass: 'text-primary',
	label: 'label',
	value: 'value',
	searchValue: false,
	showValue: false,
	showValueBeforeLabel: false,
};

export class Autocomplete {
	constructor(field, options) {
		this.field = field;
		this.options = Object.assign({}, DEFAULTS, options);
		this.dropdown = null;

		field.parentNode.classList.add('dropdown');
		field.setAttribute('data-bs-toggle', 'dropdown');
		field.classList.add('dropdown-toggle');

		const dropdown = ce(`<ol class="dropdown-menu" data-focus="-1"></ol>`);
		if (this.options.dropdownClass)
			dropdown.classList.add(this.options.dropdownClass);

		insertAfter(dropdown, field);

		this.dropdown = new bootstrap.Dropdown(field, this.options.dropdownOptions);

		field.addEventListener('click', (e) => {
			if (this.createItems() === 0) {
				e.stopPropagation();
				this.dropdown.hide();
			}
		});

		field.addEventListener('input', () => {
			this.dropdown._menu.dataset.focus = -1;
			if (this.options.onInput)
				this.options.onInput(this.field.value);
			this.renderIfNeeded();
		});

		field.addEventListener('keydown', (e) => {
			if (e.keyCode === CONFIG.key.ESC) {
				this.dropdown.hide();
				return;
			}
			if (e.keyCode === CONFIG.key.SELECT) {
				this.select(this.dropdown._menu.children[this.dropdown._menu.dataset.focus]);
				return;
			}
			if (e.keyCode === CONFIG.key.UP) {
				this.dropdown._menu.dataset.focus--;
				if (this.dropdown._menu.children.length > 0) {
					this.dropdown._menu.querySelectorAll('.dropdown-item').forEach((el) => {
						el.classList.remove('active');
					});
				}
				this.dropdown._menu.querySelectorAll('.dropdown-item')[this.dropdown._menu.dataset.focus]?.classList.add('active');
				
				if (this.dropdown._menu.dataset.focus == 0) {
					this.dropdown._menu.dataset.focus = this.dropdown._menu.children.length;
				}
				return;
			}
			if (e.keyCode === CONFIG.key.DOWN) {
				this.dropdown._menu.dataset.focus++;
				if (this.dropdown._menu.children.length > 0) {
					this.dropdown._menu.querySelectorAll('.dropdown-item').forEach((el) => {
						el.classList.remove('active');
					});
				}
				this.dropdown._menu.querySelectorAll('.dropdown-item')[this.dropdown._menu.dataset.focus]?.classList.add('active');
				
				if (this.dropdown._menu.dataset.focus == this.dropdown._menu.children.length-1) {
					this.dropdown._menu.dataset.focus = -1;
				}
				return;
			}
		});
	}

	select(target) {
		let dataLabel = target.firstChild.getAttribute('data-label');
		let dataValue = target.firstChild.getAttribute('data-value');

		this.field.value = dataLabel;

		if (this.options.onSelectItem) {
			this.options.onSelectItem({
				target: target.firstChild,
				value: dataValue,
				label: dataLabel
			});
		}

		this.dropdown.hide();
		console.log('via select method of class')
	}

	setData(data) {
		this.options.data = data;
		this.renderIfNeeded();
	}

	renderIfNeeded() {
		if (this.createItems() > 0)
			this.dropdown.show();
		else
			this.field.click();
	}

	createItem(lookup, item) {
		let label;
		if (this.options.highlightTyped) {
			const idx = removeDiacritics(item.label)
				.toLowerCase()
				.indexOf(removeDiacritics(lookup).toLowerCase());
			const className = Array.isArray(this.options.highlightClass) ? this.options.highlightClass.join(' ')
				: (typeof this.options.highlightClass == 'string' ? this.options.highlightClass : '');
			label = item.label.substring(0, idx)
				+ `<span class="${className}">${item.label.substring(idx, idx + lookup.length)}</span>`
				+ item.label.substring(idx + lookup.length, item.label.length);
		} else {
			label = item.label;
		}

		if (this.options.showValue) {
			if (this.options.showValueBeforeLabel) {
				label = `${item.value} ${label}`;
			} else {
				label += ` ${item.value}`;
			}
		}

		return ce(`<li><a href="#/${this.options.linkPath}/${item.value}" class="dropdown-item" data-label="${item.label}" data-value="${ item.value.toString().padStart(3,'0') }" value="${item.value}">${label}</a></li>`);
	}

	createItems() {
		const lookup = this.field.value;
		if (lookup.length < this.options.threshold) {
			this.dropdown.hide();
			return 0;
		}

		const items = this.field.nextSibling;
		items.innerHTML = '';

		const keys = Object.keys(this.options.data);

		let count = 0;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const entry = this.options.data[key];
			const item = {
				label: this.options.label ? entry[this.options.label] : key,
				value: this.options.value ? entry[this.options.value] : entry
			};

			if (this.doLookup(lookup, item.label, item.value) >= 0) {
				items.appendChild(this.createItem(lookup, item));
				if (this.options.maximumItems > 0 && ++count >= this.options.maximumItems)
					break;
			}
		}

		this.field.nextSibling.querySelectorAll('.dropdown-item').forEach((item) => {
			item.addEventListener('click', (e) => {
				this.select(e.currentTarget);
			});
		});

		return items.childNodes.length;
	}
	
	doLookup(needle, haystack1, haystack2) {
		var search1 = removeDiacritics(haystack1).toLowerCase().indexOf(removeDiacritics(needle).toLowerCase());
		if (!this.options.searchValue) {
			return search1;
		}
		
		var search2 = haystack2.toString().toLowerCase().indexOf(removeDiacritics(needle).toLowerCase());
		return (search1 > search2) ? search1 : search2;
	}
}

/**
 * @param html
 * @returns {Node}
 */
function ce(html) {
	let div = document.createElement('div');
	div.innerHTML = html;
	return div.firstChild;
}

/**
 * @param elem
 * @param refElem
 * @returns {*}
 */
function insertAfter(elem, refElem) {
	return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

/**
 * @param {String} str
 * @returns {String}
 */
function removeDiacritics(str) {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '');
}
