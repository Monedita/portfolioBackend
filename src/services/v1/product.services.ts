import { faker } from '@faker-js/faker';
import type { Product } from "../../models/v1/product.models";
import type { ObjectId } from "mongodb";
import { mongoService } from "./mongodb.services";


class ProductServicesV1 {
    private productsList: Product[];

    constructor() {
        this.productsList = [];
        for (let i = 0; i < 10; i++) {
            this.productsList.push({
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.number.int({ min: 0, max: 100 }),
                createAt: faker.date.past()
            });
        }
    }

    public async getAllProducts(): Promise<Product[]> {
        return await mongoService.find<Product>('products');
    }

    public getOneProduct(_id: ObjectId): Product | undefined {
        return {
            name: faker.commerce.productName(),
            price: parseFloat(faker.commerce.price()),
            description: faker.commerce.productDescription(),
            stock: faker.number.int({ min: 0, max: 100 }),
            createAt: faker.date.past()
        };
    }

    public async createProduct(productData: Omit<Product, 'createAt'>): Promise<Product> {
        const newProduct: Product = {
            createAt: new Date(),
            ...productData
        };
        const createdId: Product = await mongoService.insertOne<Product>('products', newProduct) as Product;
        return createdId;
    }

    public updateProduct(_id: ObjectId, updateData: Partial<Omit<Product, 'createAt'>>): Product | undefined {
        const productIndex = this.productsList.findIndex(product => product._id === _id);
        if (productIndex === -1) return undefined;
        const updatedProduct = {
            ...this.productsList[productIndex],
            ...updateData
        };
        this.productsList[productIndex] = updatedProduct;
        return updatedProduct;
    }

    public deleteProduct(_id: ObjectId): boolean {
        const productIndex = this.productsList.findIndex(product => product._id === _id);
        if (productIndex === -1) return false;
        this.productsList.splice(productIndex, 1);
        return true;
    }
}

const productServicesV1 = new ProductServicesV1();
export default productServicesV1;