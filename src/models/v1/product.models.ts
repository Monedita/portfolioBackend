import Joi from "joi";
import type { ObjectId } from "mongodb";

export interface Product {
    _id?: ObjectId;
    name: string;
    price: number;
    description?: string;
    stock: number;
    createAt: Date;
}

export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(100).required(),
    description: Joi.string().required(),
    stock: Joi.number().min(0).required(),
});

/*
export const updateProductSchema = Joi.object({
    _id: Joi.string().hex().length(24).required(), // if you want to validate ObjectId as string
    name: Joi.string().optional(),
    price: Joi.number().min(100).optional(),
    description: Joi.string().optional(),
    stock: Joi.number().min(0).optional(),
    createAt: Joi.date().optional(),
});
*/