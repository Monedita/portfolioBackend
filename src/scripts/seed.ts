import type Product from "../models/v1/product.models";
import { faker } from '@faker-js/faker';
import { mongoService } from "../services/v1/mongodb.services";

async function seed() {
    const productsAmount: number = await mongoService.countDocuments<Product>("products");
    console.log(`Amount of products already in the database: ${productsAmount}`);
    if (productsAmount < 100) {
        let amountAdded = 0;
        for (let i = productsAmount; i < 100; i++) {
            try {
                const product: Product = {
                    name: faker.commerce.productName(),
                    price: faker.number.int({ min: 100, max: 10000 }), // Price in cents
                    description: faker.commerce.productDescription(),
                    stock: faker.number.int({ min: 0, max: 100 }),
                    createAt: faker.date.past()
                };
                await mongoService.insertOne<Product>("products", product);
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