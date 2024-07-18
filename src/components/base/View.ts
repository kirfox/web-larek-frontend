export abstract class View<T> {
  protected constructor(protected readonly element: HTMLElement) {};

  setImage(element: HTMLImageElement, src: string) {
    if(element) element.src = src;
  }

  setText(element: HTMLElement, text: string | number) {
    if(element) element.textContent = String(text);
  }
  
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.element;
  }

  toggleClass(element: HTMLElement, className: string, force?: boolean) {
		element.classList.toggle(className, force);
	}

  setDisabled(element: HTMLElement, state: boolean) {
		if(element) {
			if(state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}
}