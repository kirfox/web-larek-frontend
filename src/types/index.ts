//интерфейс карточки товара
export interface IProduct {
    _id: string,
    description: string,
    image: string,
    title: string,
    category: string,
    price: number
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

export type TProductInfo = Pick<IProduct, 'title' | 'description' | 'category' | 'price' | 'image'>

export type TProductCart = Pick<IProduct, 'title' | 'category' | 'price'>

export type TFormPayment = Pick<IForm, 'paymentMethod' | 'deliveryAddress'>

export type TFormInfo = Pick<IForm, 'mail' | 'phone'>

// export type TFormSuccess = Pick<IForm, > ???