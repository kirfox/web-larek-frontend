import { IEvents } from "./events";
import { IProduct,IOrder, FormErrors, TOrder } from "../../types";

export class Model {
  	items: IProduct[] = [];
  	protected cartProducts: IProduct[] = [];
  	protected _order: IOrder = {
		payment: '',
		email: '',
		phone: '',
		address: '',
		items: [],
		total: 0
	};
	protected formErrors: FormErrors = {};

  	constructor(protected events: IEvents) {};
  
  	setProduct(items: IProduct[]){
    	this.items = items;
 	};

  	getProduct(cardId: string) {
  		return  this.items.find((item) => item.id === cardId)
	}

  	get cart() {
		return this.cartProducts
	}

  	addCartItem(product: IProduct) {
		if(!this.cart.includes(product)) {
			this.cart.push(product)
		}
	}

  	deleteCartItem(product: IProduct) {
		const result = this.cart.filter(item => item.id !== product.id)
		this.cartProducts = result
	}

 	setTotal(): number {
		return this.cart.reduce((sum, product) => sum + product.price, 0);
  	}

 	get order() {
		return this._order
	}

  	set order(order: IOrder) {
		this._order = order;
  	}

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if(!this._order.payment) errors.payment = 'Необходимо указать тип оплаты';
		if (!this._order.address) errors.address = 'Необходимо указать адрес';
		
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		if(!this._order.email) errors.email = 'Необходимо указать email';
		if(!this._order.phone) errors.phone = 'Необходимо указать телефон';
		
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	setOrderField(field: keyof TOrder, value: string) {
		this._order[field] = value;
		this.validateOrder() && this.validateContacts()
	}

	clearCart() {
		this.cart.splice(0, this.cart.length)
	}
}