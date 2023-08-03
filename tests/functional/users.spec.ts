import { test } from '@japa/runner';
import supertest from 'supertest';
import chai from 'chai';
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;


test.group('Users', () => {
  test('it shoub be able to create a new user', async () => {
    const user = {
      name: 'John Doe',
      email: 'test@test.com',
      password: 'test' }
    const {body} = await supertest(BASE_URL).post('/users').send(user).expect(201)
    chai.assert.exists(body.user, 'User undefined')
    chai.assert.exists(body.user.id,'Token undefined')
    chai.assert.exists(body.user.email,'Email undefined')

  })
})
