import Joi from "joi";
import type { ObjectId } from "mongodb";

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *       required:
 *         - email
 *         - password
 *         - fullName
 *     LoginUser:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       required:
 *         - email
 *         - password
 *     PublicUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         fullName:
 *           type: string
 *           description: Nombre completo del usuario
 *         admin:
 *           type: boolean
 *           description: Indica si el usuario es administrador
 *         createAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *       required:
 *         - _id
 *         - email
 *         - fullName
 *         - admin
 *         - createAt
 */


export interface User {
    _id?: ObjectId;
    email: string;
    password: string;
    fullName: string;
    admin: boolean;
    createAt: Date;
}

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    fullName: Joi.string().required(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});
