import { test } from '@japa/runner';
import supertest from 'supertest';
import chai from 'chai';
import {UserFactory} from 'Database/factories/index'
import Database from '@ioc:Adonis/Lucid/Database'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;

test.group('Users', (group) => {
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

    assert.assert.include(body.message, 'Email already exists')
    assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
    assert.assert.equal(body.status, 409)
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
})
