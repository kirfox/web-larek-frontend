import { AuctionAPI } from './components/AppApi';
import {API_URL, CDN_URL} from "./utils/constants";
import { Model } from './components/base/model';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IProduct } from './types';
import { Product } from './components/Product'
import { cloneTemplate, ensureElement } from './utils/utils';
import { ProductData } from './components/ProductData';


const api = new AuctionAPI(CDN_URL, API_URL);
const events = new EventEmitter();
const model = new Model(events);
const product = new ProductData(document.body, events);
const productListTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const gallery = ensureElement<HTMLTemplateElement>('.gallery')


const renderListProduct = (list: IProduct[]) => {
    product.setProducts = list.map((item) => {
        const productCard = new Product(cloneTemplate(productListTemplate), events);
        return productCard.render(item);
    });
}

const getProduct = (id: string) => {

}
/*
gallery.onclick = (list: IProduct[]) => {

    console.log(product.setProducts );
    
    const productCard = new Product(cloneTemplate(productListTemplate), events);
    // return productCard.render(item);
} 

*/


events.on("products:render", renderListProduct);

// events.on("products:selected", getProduct);



api.getListProduct()
    .then((item) =>  model.setProduct(item))
    .catch(err => {
        console.error(err);
    });

