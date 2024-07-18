import { View } from "./base/View";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";

interface IModalWithСart {
    products: HTMLElement[];
	total: number | null;
	selected: number
}

export class ModalWithСart<IModalWithСart> extends View<IModalWithСart> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;
    
	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
        
		this._list = ensureElement<HTMLElement>('.basket__list', this.element);
		this._total = this.element.querySelector('.basket__price');
		this._button = this.element.querySelector('.basket__button');

		if(this._button) {
			this._button.addEventListener('click', () => {
				events.emit('payment:change');
			});
		}
		this.products = [];
	}

	set selected(items: number) {
		this.setDisabled(this._button, items <= 0);
	}

	set products(products: HTMLElement[]) {
		this._list.replaceChildren(...products)
	}

	set total(total: number) {
		this.setText(this._total, `${total}` + ' синапсисов')
	}
}




