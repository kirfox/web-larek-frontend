import { Api, ApiListResponse } from './base/api';
import {IApi, IProduct} from "../types";

export interface IAuctionAPI {
    getListProduct: () => Promise<IProduct[]>;

}

export class AuctionAPI extends Api implements IAuctionAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    // getLotItem(id: string): Promise<ILot> {
    //     return this.get(`/lot/${id}`).then(
    //         (item: ILot) => ({
    //             ...item,
    //             image: this.cdn + item.image,
    //         })
    //     );
    // }


    getListProduct(): Promise<IProduct[]> {
        return this.get('/product/').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

   

}