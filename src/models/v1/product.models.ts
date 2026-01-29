import type { ObjectId } from "mongodb";

export default interface Product {
    _id?: ObjectId;
    name: string;
    price: number;
    description?: string;
    stock: number;
    createAt: Date;
}