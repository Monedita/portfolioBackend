
import type { Request, Response } from 'express';
import type { User } from '../../models/v1/user.models';
import { createUserSchema, loginUserSchema } from '../../models/v1/user.models';
import express from 'express';
import schemaValidator from '../../middlewares/schemaValidator.middleware';
import authServicesV1 from '../../services/v1/auth.services';

const router = express.Router();


/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario y devuelve un JWT.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Email o contraseña inválidos.
 */
router.post('/login',
  schemaValidator(loginUserSchema, 'body'),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await authServicesV1.loginUser(email, password);
    if (!token) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.json({ message: "user logged in successfully", token });
  }
);


/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUser'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicUser'
 */
router.post('/register',
  schemaValidator(createUserSchema, 'body'),
  async (req: Request, res: Response) => {
    let user: User;
    try {
      user = await authServicesV1.createUser(req.body);
    } catch (error: any) {
      if (error.message === 'Email already exists') {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
    const { password, ...publicUser } = user;
    return res.status(201).json(publicUser);
  }
);


export default router;