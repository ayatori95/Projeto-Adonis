import { test } from '@japa/runner';
import supertest from 'supertest';
import chai from 'chai';
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;


test.group('Users', () => {
  test('it shoub be able to create a new user', async () => {
    const userPayload = {
      name: 'John Doe',
      email: 'test@test.com',
      password: 'test' }
    const {body} = await supertest(BASE_URL).post('/users').send(userPayload).expect(201)
    chai.assert.exists(body.user, 'User undefined')
    chai.assert.exists(body.user.id,'Token undefined')
    chai.assert.equal(body.user.email, userPayload.email)
    chai.assert.equal(body.user.name, userPayload.name)
    chai.assert.equal(body.user.password,userPayload.password)
  })
})
