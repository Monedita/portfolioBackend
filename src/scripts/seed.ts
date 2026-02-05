import bcrypt from 'bcrypt';
import type { Product } from "../models/v1/product.models";
import type { User } from "../models/v1/user.models";
import { faker } from '@faker-js/faker';
import { MongoClient, Db, Collection, IndexDescriptionInfo } from "mongodb";


async function seed() {

    // Seed settings
    const MONGO_URI: string = process.env.MONGO_URI || "mongodb://user:pass@localhost:27017";
    const DB_NAME: string = process.env.DB_NAME || "portfolio";
    const TARGET_PRODUCT_COUNT: number = parseInt(process.env.TARGET_PRODUCT_COUNT || "100", 10);
    const PRODUCT_COLLECTION: string = process.env.PRODUCT_COLLECTION || "products";
    const USER_COLLECTION = process.env.USER_COLLECTION || "users";
    const BACKEND_USER: string = process.env.BACKEND_USER || "dbUser";
    const BACKEND_PASSWORD: string = process.env.BACKEND_PASSWORD || "Secure1234!";
    
    // MongoDb connection
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db: Db = client.db(DB_NAME);
    const col: Collection<Product> = db.collection(PRODUCT_COLLECTION);
    const userCol: Collection<User> = db.collection(USER_COLLECTION);

    // Create text index in products
    let indexes: IndexDescriptionInfo[] = [];
    try {
        indexes = await col.indexes();
    } catch (err) {
        // La colección no existe todavía
        console.log("No indexes found, collection might not exist yet.");
    }
    console.log("Existing indexes:", indexes.map(i => i.name).join(", "));
    const indexExists = indexes.some(i => i.name === "product_search_index");
    if (!indexExists) {
        await col.createIndex(
            { name: "text", description: "text" },
            { name: "product_search_index" }
        );
        console.log("Index 'product_search_index' CREATED!.");
    } else {
        console.log("Index 'product_search_index' already exists.");
    }

    // Create admin user if not exists
    const admin: User = {
        email: "admin@example.com",
        password: await bcrypt.hash("adminpassword", 10),
        fullName: "Admin User",
        admin: true,
        createAt: new Date()
    };
    const existingAdmin = await userCol.findOne({ email: admin.email });
    if (!existingAdmin) {
        await userCol.insertOne(admin);
        console.log("Admin user created with email: " + admin.email + " and password: adminpassword");
    }

    // Populate with products
    const productsAmount: number = await col.countDocuments({});
    console.log(`Amount of products already in the database: ${productsAmount}`);
    if (productsAmount < TARGET_PRODUCT_COUNT) {
        let amountAdded = 0;
        for (let i = productsAmount; i < TARGET_PRODUCT_COUNT; i++) {
            try {
                const product: Product = {
                    name: faker.commerce.productName(),
                    price: faker.number.int({ min: 100, max: 10000 }), // Price in cents
                    description: faker.commerce.productDescription(),
                    stock: faker.number.int({ min: 0, max: 100 }),
                    createAt: faker.date.past()
                };
                await col.insertOne(product);
                console.log(`Product inserted: ${product.name}`);
                amountAdded++;
            } catch (error) {
                console.error("Error inserting product:", error);
            }
        }
        console.log(`Products added: ${amountAdded}`);
    }

    // Create mongoDb user if not exists
    const adminDb: Db = client.db("admin");
    const users = await adminDb.command({ usersInfo: BACKEND_USER });
    let dbUserExists = users.users?.some((u: { user: string }) => u.user === BACKEND_USER);
    if (!dbUserExists) {
        try {
            await adminDb.command({
                createUser: BACKEND_USER,
                pwd: BACKEND_PASSWORD,
                roles: [{ role: "readWrite", db: DB_NAME }]
            });
            console.log(`MongoDB user '${BACKEND_USER}' created.`);
        } catch (error) {
            console.error("Error creating MongoDB user:", error);
        }
    } else {
        console.log(`MongoDB user '${BACKEND_USER}' already exists.`);
    }

    // Close connection
    await client.close();
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