import { IProduct } from "../types/index";
import { View } from "./base/View";;
import { IEvents } from "./base/events";

export class Product extends View<IProduct> {
  // protected id: HTMLElement;
  protected _description: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;


  constructor(element: HTMLElement, events: IEvents) {
    super(element, events);

    this._description = element.querySelector(`.card__text`);
    this._image = element.querySelector(`.card__image`);
    this._title = element.querySelector(`.card__title`);
    this._category = element.querySelector(`.card__category`);
    this._price = element.querySelector(`.card__price`);
  }

  get id(): string {
    return this.element.dataset.id;
  }

  set id(id: string) {
    this.element.dataset.id = id;
  }

  get description(): string {
    return this._description.textContent;
  }

  set description(description: string) {
    this.setText(this._description, description);
  }

  set image(image: string) {    
    this.setImage(this._image, image);
  }

  get title(): string {
    return this._title.textContent;
  }

  set title(title: string) {
    this.setText(this._title, title);
  }

  get category(): string {
    return this._category.textContent;
  }

  set category(category: string) {
    this.setText(this._category, category);
  }

  get price(): string {
    return this._price.textContent;
  }

  set price(price: string) {
    if (price) this.setText(this._price, `${price} синапсов`);
    else this.setText(this._price, price);
  }


  elementUpdate(data?: Partial<IProduct>): HTMLElement {
    Object.assign(this as object, data ?? {});
    if(data) {
      // this.item = data as IProduct
    }
    return this.element;
  }



}