import { View } from './base/View'
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IModal {
	content: HTMLElement;	
}

export class Modal<IModal> extends View<IModal> {
	protected _content: HTMLElement;
    protected closeButton: HTMLButtonElement;
    protected wrapper: HTMLElement;
    protected _basket: HTMLElement;
	protected _counter: HTMLElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
		
		this.closeButton = this.element.querySelector('.modal__close');
		this._content = this.element.querySelector('.modal__content');
		this.closeButton.addEventListener('click', this.close.bind(this));
		this.element.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
        this.wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._basket.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set content(value: HTMLElement) {
        this._content.replaceChildren(value);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	open() {
		this.toggleModal();
	}

	close() {
		this.toggleModal(false);
		this.content = null;
		this.events.emit('modal:close');
	}

    toggleModal(state: boolean = true) {
		this.toggleClass(this.element, 'modal_active', state);
		this.toggleClass(this.wrapper, 'page__wrapper_locked', state)
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.element;
	}
}