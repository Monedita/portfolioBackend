import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { User } from "../../models/v1/user.models";
import { ObjectId } from "mongodb";

// Database service
import { mongoService } from "./mongodb.services";

const USER_COLLECTION = 'users';
const JWT_SECRET = process.env.JWT_SECRET || "Pl.E@k3y!Pl.E@k3y!";
const JWT_OPTIONS = process.env.JWT_OPTIONS
    ? JSON.parse(process.env.JWT_OPTIONS)
    : { expiresIn: '1h', issuer: 'demoBackend' }


class AuthServicesV1 {

    public async createUser(userData: Omit<User, 'createAt' | 'admin'>): Promise<User> {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser: User = {
            ...userData,
            password: hashedPassword,
            createAt: new Date(),
            admin: false,
        };
        const existingUser = await mongoService.findOne<User>(USER_COLLECTION, { email: userData.email });
        if (existingUser) {
            throw new Error('Email already exists');
        }
        const createdId: ObjectId = await mongoService.insertOne<User>(USER_COLLECTION, newUser);
        return { _id: createdId, ...newUser };
    }

    public async loginUser(email: string, password: string): Promise<string | null> {
        const user = await mongoService.findOne<User>(USER_COLLECTION, { email });
        if (!user) return null;
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return null;
        const token = jwt.sign(
            { admin: user.admin, email: user.email, fullName: user.fullName },
            JWT_SECRET,
            JWT_OPTIONS
        );
        return token;
    }

}

const authServicesV1 = new AuthServicesV1();
export default authServicesV1;