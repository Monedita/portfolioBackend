import type { Product } from "../../models/v1/product.models";
import type { WithId, DeleteResult, UpdateResult } from "mongodb";
import { ObjectId } from "mongodb";

// Database service
import { mongoService } from "./mongodb.services";

class ProductServicesV1 {

    public async getAllProducts(): Promise<Product[]> {
        return await mongoService.find<Product>('products');
    }

    public async getOneProduct(_id: string): Promise<WithId<Product> | null> {
        const objectId = new ObjectId(_id);
        return await mongoService.findOne<Product>('products', { _id: objectId });
    }

    public async createProduct(productData: Omit<Product, 'createAt'>): Promise<Product> {
        const newProduct: Product = {
            createAt: new Date(),
            ...productData
        };
        const createdId: Product = await mongoService.insertOne<Product>('products', newProduct) as Product;
        return createdId;
    }

    public async replaceProduct(_id: string, productData: Omit<Product, 'createAt'>): Promise<Product | null> {
        const objectId = new ObjectId(_id);
        const newProduct: Product = {
            createAt: new Date(),
            ...productData
        };
        return await mongoService.findOneAndReplace<Product>('products', { _id: objectId }, newProduct);
    }

    public async updateProduct(_id: string, updateData: Partial<Omit<Product, 'createAt'>>): Promise<Product | null> {
        const objectId = new ObjectId(_id);
        return await mongoService.findOneAndUpdate<Product>('products', { _id: objectId }, updateData);
    }

    public async deleteProduct(_id: string): Promise<DeleteResult> {
        const objectId = new ObjectId(_id);
        return await mongoService.deleteOne<Product>('products', { _id: objectId });
    }
}

const productServicesV1 = new ProductServicesV1();
export default productServicesV1;