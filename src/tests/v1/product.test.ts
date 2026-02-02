import request from 'supertest';
import app from '../../index';

import type { Product } from '../../models/v1/product.models';

const route: string = '/api/v1/products';

describe('V1', () => {
    describe('Product API', () => {

        let createdProductId: string;

        describe(`POST ${route}`, () => {
            it('should create a new product', async () => {
                const newProduct: Omit<Product, 'createAt'> = {
                    name: 'Test Product',
                    price: 1999,
                    description: 'A product for testing purposes',
                    stock: 100
                };
                const res = await request(app).post(route).send(newProduct);
                expect(res.statusCode).toBe(201);
                expect(res.body).toHaveProperty('_id');
                createdProductId = res.body._id;
            });
        });

        describe(`PATCH ${route}/:_id`, () => {
            it('should partially update the created product', async () => {
                const updates = {
                    description: 'An updated description for testing purposes'
                };
                const res = await request(app).patch(`${route}/${createdProductId}`).send(updates);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', createdProductId);
                expect(res.body).toHaveProperty('description', updates.description);
            });
        });

        describe(`GET ${route}/:_id`, () => {
            it('should get the created product by ID', async () => {
                const res = await request(app).get(`${route}/${createdProductId}`);
                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('_id', createdProductId);
                expect(res.body).toHaveProperty('name', 'Test Product');
                expect(res.body).toHaveProperty('price', 1999);
                expect(res.body).toHaveProperty('description', 'An updated description for testing purposes');
                expect(res.body).toHaveProperty('stock', 100);
                expect(res.body).toHaveProperty('createAt');
            });
        });

        describe(`PUT ${route}/:_id`, () => {
            it('should fully update the created product', async () => {
                const newProduct: Omit<Product, 'createAt'> = {
                    name: 'Test Product',
                    price: 1999,
                    description: 'A product for testing purposes',
                    stock: 100
                };
                const res = await request(app).put(`${route}/${createdProductId}`).send(newProduct);
                expect(res.statusCode).toBe(200);
                const res2 = await request(app).get(`${route}/${createdProductId}`);
                expect(res2.statusCode).toBe(200);
                expect(res2.body).toHaveProperty('_id', createdProductId);
                expect(res2.body).toHaveProperty('name', newProduct.name);
                expect(res2.body).toHaveProperty('price', newProduct.price);
                expect(res2.body).toHaveProperty('description', newProduct.description);
                expect(res2.body).toHaveProperty('stock', newProduct.stock);
                expect(res.body).toHaveProperty('createAt');
            });
        });

        describe(`GET ${route}`, () => {
            it('should return a list of products', async () => {
                const res = await request(app).get(route);
                expect(res.statusCode).toBe(200);
                expect(Array.isArray(res.body)).toBe(true);
                expect(res.body.length).toBeGreaterThan(0);
            });
        });

        describe(`DELETE ${route}/:_id`, () => {
            it('should delete the created product', async () => {
                const res = await request(app).delete(`${route}/${createdProductId}`);
                expect(res.statusCode).toBe(204);
                const res2 = await request(app).get(`${route}/${createdProductId}`);
                expect(res2.statusCode).toBe(404);
            });
        });

    });
});