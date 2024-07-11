import { IEvents } from "./events";


export abstract class View<T> {
  protected constructor(protected readonly element: HTMLElement, protected readonly events: IEvents) {};

  setImage(element: HTMLImageElement, src: string) {
    if (element)
      element.src = src;
  }

  setText(element: HTMLElement, text: string) {
    if (element)
      element.textContent = text;
  }
  
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.element;
  }
}