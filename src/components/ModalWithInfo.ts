import { IEvents } from './base/events';
import { IOrder } from '../types';
import { ModalForm } from './ModalForm';

export class ModalWithInfo extends ModalForm<IOrder> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._email = container.elements.namedItem('email') as HTMLInputElement
		this._phone = container.elements.namedItem('phone') as HTMLInputElement
	}

	set phone(value: string) {
		this._phone.value = value;
	}

	set email(value: string) {
		this._email.value = value;
	}
}