import type Product from "../models/v1/product.models";
import { faker } from '@faker-js/faker';
import { mongoService } from "../services/v1/mongodb.services";

export default async function seed() {
    const productsAmount: number = await mongoService.countDocuments<Product>("products");
    console.log(`Amount of products already in the database: ${productsAmount}`);
    if (productsAmount < 100) {
        let amountAdded = 0;
        for (let i = productsAmount; i < 100; i++) {
            try {
                const product: Omit<Product, 'id'> = {
                    // id: faker.string.uuid(),
                    name: faker.commerce.productName(),
                    price: parseFloat(faker.commerce.price()),
                    description: faker.commerce.productDescription(),
                    stock: faker.number.int({ min: 0, max: 100 }),
                    createAt: faker.date.past()
                };
                await mongoService.insertOne<Omit<Product, 'id'>>("products", product);
                console.log(`Product inserted: ${product.name}`);
                amountAdded++;
            } catch (error) {
                console.error("Error inserting product:", error);
            }
        }
        console.log(`Products added: ${amountAdded}`);
    }
}

// Permitir ejecución directa desde CLI
if (require.main === module) {
    seed()
        .then(() => {
            console.log("Seed finalizado correctamente.");
            process.exit(0);
        })
        .catch((err) => {
            console.error("Error ejecutando seed:", err);
            process.exit(1);
        });
}