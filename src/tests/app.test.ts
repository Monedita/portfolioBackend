import request from 'supertest';
import app from '../index';

describe('GET /', () => {
  it('should return Server working!', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Server working!');
  });
});