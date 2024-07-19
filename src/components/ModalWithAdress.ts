import { IOrder } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';


export class ModalWithAdress extends Form<IOrder> {
	protected cash: HTMLButtonElement;
	protected card: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected _payment: string;

	constructor(element: HTMLFormElement, events: IEvents)  {
		super(element, events)

		this.cash = this.element.querySelector('button[name="cash"]');
		this.card = this.element.querySelector('button[name="card"]');
		this._address = element.elements.namedItem('address') as HTMLInputElement;

		this.cash.addEventListener('click', () => {
			this.toggleCash();
			this.toggleCard(false);
			this.setPayment(this.cash);
		})

		this.card.addEventListener('click', () => {
			this.toggleCard();
			this.toggleCash(false);
			this.setPayment(this.card);
		})
	};

	set address(value: string) {
		this._address.value = value;
	}

	toggleCard(state: boolean = true) {
		this.toggleClass(this.card, 'button_alt-active', state);
	}

	toggleCash(state: boolean = true) {
		this.toggleClass(this.cash, 'button_alt-active', state);
	}

	setPayment(button: HTMLButtonElement) {

		if(button.classList.contains('button_alt-active') && button.getAttribute('name') === 'card') {
			this._payment = 'card'
		} else {
			this._payment = 'cash'
		}

		this.events.emit('payment:choosed', { payment: this._payment })
	}
}