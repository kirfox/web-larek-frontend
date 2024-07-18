import { ModalWithInfo } from './components/ModalWithInfo';
import { AuctionAPI } from './components/AppApi';
import { API_URL, CDN_URL} from "./utils/constants";
import { Model } from './components/base/Model';
import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { IProduct, IOrder, TOrder } from './types';
import { Product } from './components/Product'
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductData } from './components/ProductData';
import { Modal } from './components/Modal';
import { ModalWithСart } from './components/ModalWithСart';
import { ModalWithAdress } from './components/ModalWithAdress';
import { Success } from './components/Success';


const api = new AuctionAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const model = new Model(events);
const product = new ProductData(document.body);
const productListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cartItem = ensureElement<HTMLTemplateElement>('#card-basket');
const cart = new ModalWithСart(cloneTemplate(cartTemplate), events);

const adressTemplate = ensureElement<HTMLTemplateElement>('#order');
const modalWithAdress = new ModalWithAdress(cloneTemplate(adressTemplate), events);
const infoTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalWithInfo = new ModalWithInfo(cloneTemplate(infoTemplate), events);
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

api.getListProduct()
    .then(data => {
        model.setProduct(data) 
        events.emit('products:render', data);
    })
    .catch(err => console.error(err));    

events.on("products:render", (list: IProduct[]) => {
    product.setProducts = list.map((item) => {
        const productCard = new Product(cloneTemplate(productListTemplate), {
			onClick: () => {
                events.emit('product:selected', item)
            }
		});   
        return productCard.render(item);
    });
});

events.on('product:selected', (item: IProduct) => {
	const selectedCard = model.getProduct(item.id);
	
	const preview = new Product(cloneTemplate(productCardTemplate), {
		onClick: () => {
            if(model.cart.includes(item)) {
				preview.setText(preview.btn, 'В корзину');
				events.emit('cart:deleteProduct', item);
			} else {
				events.emit('cart:addProduct', item);
				preview.setText(preview.btn, 'Удалить из корзины');
			}
        }
	});

	preview.setText(preview.btn, model.cart.includes(item) ? 'Удалить из корзины' : 'В корзину');
    
    if(selectedCard.price === null) preview.setDisabled(preview.btn, true);
	
    modal.render({
		content: preview.render({
			image: item.image,
			title: item.title,
			category: item.category,
			price: item.price,
			description: item.description
		})
	});
})

events.on('cart:open', () => {
	const products = model.cart.map((item, count) => {
		const product = new Product(cloneTemplate(cartItem), {
			onClick: () => {   
				events.emit('cart:deleteProduct', item);
				events.emit('cart:open');
			}
		});

		return product.render({
			id: item.id,
			title: item.title,
			price: item.price,
			count: ++count
		});
	});

	modal.render({
		content: cart.render({
			products,
			total: model.setTotal(),
			selected: products.length
		})
	});
});

events.on('cart:addProduct', (item: IProduct) => {
	model.addCartItem(item);
	modal.counter = model.cart.length;
});

events.on('cart:deleteProduct', (item: IProduct) => {
	model.deleteCartItem(item);
	modal.counter = model.cart.length;
});

events.on('payment:change', () => {
	model.order.total = model.setTotal();
	model.order.items = model.cart.map(item => item.id);
	modal.render({
		content: modalWithAdress.render({
			valid: false,
			errors: []
		})
	});
});

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	const { phone, email } = errors;

	modalWithAdress.valid = !payment && !address;
	modalWithAdress.errors = Object.values({ address, payment }).filter(Boolean).join('; ');
	modalWithInfo.valid = !phone && !email;
	modalWithInfo.errors = Object.values({ phone, email }).filter(Boolean).join('; ');
});

const onChangeField = (data: { field: keyof TOrder, value: string }) => {
	model.setOrderField(data.field, data.value);
};

events.on(/^order\..*:change/, onChangeField);
events.on(/^contacts\..*:change/, onChangeField);

events.on('payment:choosed', (data: { payment: string }) => {
	model.setOrderField('payment', data.payment);
});

events.on('order:submit', () => {
	modal.render({
		content: modalWithInfo.render({
			valid: false,
			errors: []
		})
	});
});

events.on('contacts:submit', () => {
	api.orderProducts(model.order)
		.then(() => {
			model.clearCart();
			model.order = {
				payment: "",
				email: "",
				phone: "",
				address: "",
				items: [],
				total: model.order.total
			};
			modal.counter = model.cart.length;

			const successView = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					model.order.total = 0;
				}
			});

			modal.render({
				content: successView.render({
					total: model.order.total
				})
			});
		})
		.catch(err => console.error(err));
});


