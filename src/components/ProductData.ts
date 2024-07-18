import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";
import { IProductData } from "../types";
import { View } from "./base/View";

export class ProductData extends View<IProductData> {

  protected counter: HTMLElement;
  protected products: HTMLElement;

  constructor(element: HTMLElement) {
    super(element);
    this.products = ensureElement<HTMLElement>(".gallery");
  }

  set setProducts(items: HTMLElement[]) {
    this.products.replaceChildren(...items);
  }
}