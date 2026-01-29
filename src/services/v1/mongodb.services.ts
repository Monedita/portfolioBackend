import type { Document, OptionalUnlessRequiredId } from "mongodb";
import { MongoClient, Db, Collection } from "mongodb";

class MongoService {
    private client: MongoClient;
    private dbName: string;

    constructor(uri: string, dbName: string) {
        this.client = new MongoClient(uri);
        this.dbName = dbName;
    }

    private async getDb(): Promise<Db> {
        try {
            await this.client.connect();
            return this.client.db(this.dbName);
        } catch (error) {
            console.error("Error conectando a MongoDB:", error);
            throw error;
        }
    }

    async getCollection<T extends Document>(name: string): Promise<Collection<T>> {
        const db = await this.getDb();
        return db.collection<T>(name);
    }

    async insertOne<T extends Document>(collectionName: string, doc: OptionalUnlessRequiredId<T>) {
        const col = await this.getCollection<T>(collectionName);
        return col.insertOne(doc);
    }

    async find<T extends Document>(collectionName: string, query = {}) {
        const col = await this.getCollection<T>(collectionName);
        return col.find(query).toArray();
    }

    async countDocuments<T extends Document>(collectionName: string, query = {}) {
        const col = await this.getCollection<T>(collectionName);
        return col.countDocuments(query);
    }
}

const uri = process.env.MONGO_URI || "mongodb://user:pass@localhost:27017";
const dbName = process.env.DB_NAME || "portfolio";
export const mongoService = new MongoService(uri, dbName);
