import { AbsctractApi } from "./abstract_api";
import { API_URL } from "./config";
import { toDate, removeHeaderFromImage, capitalizeFirstLetter, addDomainToUrl } from "./utils";
import axios from "axios";

const productApiUrl = `${API_URL}product/`

export interface CreateProduct {
    type: string;
    subType: string;
    name: string;
    description: string;
    productType: string;
    price: number;
    stock: number;
    volume: number;
    images: string[];
}

export interface UpdateProduct {
    id: string;
    type?: string;
    subType?: string;
    name?: string;
    description?: string;
    productType?: string;
    price?: number;
    additionalStock?: number;
    volume?: number;
    images?: string[];
    status?: string;
}

export interface Product {
    id: string;
    type: string;
    subType: string;
    name: string;
    description: string;
    productType: string;
    price: number;
    stock: number;
    volume: number;
    images: string[];
    stockModifiedDate: Date;
    createdDate: Date;
    status: string;
}


export class ProductApi extends AbsctractApi {

    async create(productData: CreateProduct): Promise<Product | undefined> {
        try{
            const request = this.mapCreateProductData(productData)
            const response = await axios.post(`${productApiUrl}`, request)
            return this.map(response.data.data)
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async update(productData: UpdateProduct): Promise<Product | undefined> {
        try{
            const request = this.mapUpdateProductData(productData)
            const response = await axios.put(`${productApiUrl}`, request)
            return this.map(response.data.data)
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async getAll(): Promise<Product[] | undefined> {
        try{
            const response = await axios.get(`${productApiUrl}`)
            return response.data.data.map((data: any) => this.map(data))
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async get(id: string): Promise<Product | undefined> {
        try{
            const response = await axios.get(productApiUrl, { params: { id } })
            return this.map(response.data.data)
        }
        catch (error) {
            this.catchError(error);
        }
    }

    async delete(id: string): Promise<void | undefined> {
        try{
            await axios.delete(productApiUrl, { params: { id } })
        }
        catch (error) {
            this.catchError(error);
        }
    }

    private mapCreateProductData(data: CreateProduct): any{
        return {
            service_type: data.type.toUpperCase(),
            service_subtype: data.subType.toUpperCase(),
            name: data.name,
            description: data.description,
            product_type: data.productType.toUpperCase(),
            price: data.price,
            stock: data.stock,
            volume: data.volume,
            images: data.images.map(removeHeaderFromImage)
        }
    }

    private mapUpdateProductData(data: UpdateProduct): any{
        return {
            id: data.id,
            service_type: data.type?.toUpperCase(),
            service_subtype: data.subType?.toUpperCase(),
            name: data.name,
            description: data.description,
            product_type: data.productType?.toUpperCase(),
            price: data.price,
            additional_stock: data.additionalStock,
            volume: data.volume,
            images: data.images?.map(removeHeaderFromImage),
            status: data.status
        }
    }

    private map(data: any) : Product {
        return {
            id: data.id,
            type: capitalizeFirstLetter(data.service_type),
            subType: capitalizeFirstLetter(data.service_subtype),
            name: data.name,
            description: data.description,
            productType: capitalizeFirstLetter(data.product_type),
            price: data.price,
            stock: data.stock,
            volume: data.volume,
            images: data.images.map(addDomainToUrl),
            stockModifiedDate: toDate(data.stock_modified_date),
            createdDate: toDate(data.created_date),
            status: data.status
        }
    }
}