import { test } from '@japa/runner';
import supertest from 'supertest';
import chai from 'chai';
import User from 'App/Models/User';
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
import {UserFactory} from 'Database/factories/index'


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
    chai.assert.notExists(body.user.password, 'Password should not be returned')
  })
  test('it shoud return 409 when trying to create a user with an existing email', async (assert) => {
    const {email} = await UserFactory.create()
    const {body} = await supertest(BASE_URL).post('/users').send({
      name: 'John Doe',
      email,
      password: 'test'
    }).expect(409)
  })
})
