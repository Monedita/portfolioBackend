import { faker } from '@faker-js/faker';
import Product from "../../models/v1/product.models";

class ProductServicesV1 {
    private productsList: Product[];
    
    constructor() {
        this.productsList = [];
        for (let i = 0; i < 10; i++) {
            this.productsList.push({
                id: faker.string.uuid(),
                name: faker.commerce.productName(),
                price: parseFloat(faker.commerce.price()),
                description: faker.commerce.productDescription(),
                stock: faker.number.int({ min: 0, max: 100 }),
                createAt: faker.date.past()
            });
        }
    }

    public getAllProducts(): Product[] {
        return this.productsList;
    }

    public getOneProduct(id: string): Product | undefined {
        return this.productsList.find(product => product.id === id);
    }

    public createProduct(productData: Omit<Product, 'id' | 'createAt'>): Product {
        const newProduct: Product = {
            id: faker.string.uuid(),
            createAt: new Date(),
            ...productData
        };
        this.productsList.push(newProduct);
        return newProduct;
    }

    public updateProduct(id: string, updateData: Partial<Omit<Product, 'id' | 'createAt'>>): Product | undefined {
        const productIndex = this.productsList.findIndex(product => product.id === id);
        if (productIndex === -1) return undefined;
        const updatedProduct = {
            ...this.productsList[productIndex],
            ...updateData
        };
        this.productsList[productIndex] = updatedProduct;
        return updatedProduct;
    }

    public deleteProduct(id: string): boolean {
        const productIndex = this.productsList.findIndex(product => product.id === id);
        if (productIndex === -1) return false;
        this.productsList.splice(productIndex, 1);
        return true;
    }
}

const productServicesV1 = new ProductServicesV1();
export default productServicesV1;