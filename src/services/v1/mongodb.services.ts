import type { Document, InsertOneResult, ObjectId, OptionalUnlessRequiredId, UpdateResult, WithId } from "mongodb";
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
            //Dont worry about multiple connections, MongoClient handles that internally
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

    async insertOne<T extends Document>(collectionName: string, doc: OptionalUnlessRequiredId<T>): Promise<ObjectId> {
        const col = await this.getCollection<T>(collectionName);
        const result = await col.insertOne(doc);
        if (!result.acknowledged) {
            throw new Error("Insert operation was not acknowledged");
        } else {
         return result.insertedId;
        }
    }

    async find<T extends Document>(collectionName: string, query = {}) {
        const col = await this.getCollection<T>(collectionName);
        return col.find(query).toArray();
    }

    async findOne<T extends Document>(collectionName: string, query = {}): Promise<WithId<T> | null> {
        const col = await this.getCollection<T>(collectionName);
        return col.findOne(query);
    }

    async findOneAndReplace<T extends Document>(collectionName: string, query = {}, replacement: T): Promise<WithId<T> | null> {
        const col = await this.getCollection<T>(collectionName);
        return await col.findOneAndReplace(query, replacement, { returnDocument: 'after' });
    }

    async findOneAndUpdate<T extends Document>(collectionName: string, query = {}, updateData: Partial<T>): Promise<WithId<T> | null> {
        const col = await this.getCollection<T>(collectionName);
        return await col.findOneAndUpdate(query, { $set: updateData }, { returnDocument: 'after' });
    }

    async deleteOne<T extends Document>(collectionName: string, query = {}) {
        const col = await this.getCollection<T>(collectionName);
        const result = await col.deleteOne(query);
        return result;
    }

    async countDocuments<T extends Document>(collectionName: string, query = {}) {
        const col = await this.getCollection<T>(collectionName);
        return col.countDocuments(query);
    }
}

const uri = process.env.MONGO_URI || "mongodb://user:pass@localhost:27017";
const dbName = process.env.DB_NAME || "portfolio";
export const mongoService = new MongoService(uri, dbName);
