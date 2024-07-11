import { IEvents } from "./events";
import { IProduct } from "../../types";

export class Model {
  items: IProduct[] = [];

  constructor(protected events: IEvents) {};
  
  setProduct(items: IProduct[]){
    this.items = items;
    this.events.emit('products:render', this.items);
  };

  getProduct(items: IProduct[]){
    this.items = items;
    this.events.emit('products:selected', this.items);
  };

}