//интерфейс карточки товара
export interface IProduct {
    id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number,
    count: number
}

//интерфейс с данными покупателя 
export interface IForm {
   phone: string,
   mail: string,
   paymentMethod: string,
   deliveryAddress?: string 
}   

//для отображения отдельной карточки продукта
export interface IProductData {
    products: IProduct[],
    preview: string | null,
    getProduct(productId: string): IProduct
}

export interface IApi {
    baseUrl: string;
    get(uri: string): void;
    post(uri: string, data: object): void;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	items: string[];
	total: number;
}

export interface IOrderResult {
	id: string;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;
