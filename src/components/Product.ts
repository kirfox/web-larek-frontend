import { IProduct } from "../types/index";
import { View } from "./base/View";;
import { IEvents } from "./base/events";

interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

export class Product extends View<IProduct> {
  protected _description: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category: HTMLElement;
  protected _categoryColor = <Record<string, string>> {
    "дополнительное": "additional",
		"софт-скил": "soft",
		"хард-скил": "hard",
    "другое": "other",
		"кнопка": "button",
	}
  protected _price: HTMLElement;
  protected _btn?: HTMLElement;
  protected _count?: HTMLElement;


  constructor(element: HTMLElement, actions?: IProductActions) {
    super(element);

    this._description = element.querySelector(`.card__text`);
    this._image = element.querySelector(`.card__image`);
    this._title = element.querySelector(`.card__title`);
    this._category = element.querySelector(`.card__category`);
    this._price = element.querySelector(`.card__price`);
    this._btn = element.querySelector(`.card__button`);
    this._count = element.querySelector(`.basket__item-index`);
    

    if (actions?.onClick) {
			if (this._btn) {
				this._btn.addEventListener('click', actions.onClick);
			} else {
			  element.addEventListener('click', actions.onClick);
			}
		}
    
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

  set category(value: string) {
    this.setText(this._category, value);
    this.toggleClass(this._category, `card__category_${this._categoryColor[value]}`, true)
  }

  get price(): string {
    return this._price.textContent;
  }

  set price(price: string) {
    if (price) this.setText(this._price, `${price} синапсов`);
    else this.setText(this._price, `Бесценно`);
  }

  get btn() {
		return this._btn
	}

  set count(value: number | null) {
		this.setText(this._count, value)
	}
}