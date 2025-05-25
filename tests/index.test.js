//this file needs npm install --save-dev jest supertest

const request = require('supertest');
const express = require('express');
const app = require('../backend/index');

jest.mock('../backend/database-pool', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('Server API Routes', () => {
  // Login Test
  test('POST /login - should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({ email: 'wrong@example.com', password: 'incorrect' });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
  });

  // Signup Test
  test('POST /signup - should fail with missing fields', async () => {
    const response = await request(app)
      .post('/signup')
      .send({ email: 'test@example.com' }); // Missing nickname & password

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
  });

  // Notes - GET
  test('GET /notes - should return notes list (may be empty)', async () => {
    const response = await request(app).get('/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Notes - POST
  test('POST /notes - should create a new note', async () => {
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note',
      dateCreated: new Date().toISOString(),
      userId: 1
    };

    const response = await request(app)
      .post('/notes')
      .send(newNote);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('title', 'Test Note');
  });

  // Streak - GET
  test('GET /streak/:userId - should return streak info', async () => {
    const response = await request(app).get('/streak/1');
    expect([200, 404]).toContain(response.status); // May return 404 if user not found
  });
});