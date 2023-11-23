import { test } from '@japa/runner';
import supertest from 'supertest';
import chai from 'chai';
import {UserFactory} from 'Database/factories/index'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import { assert } from '@japa/preset-adonis';

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

  test('it shoud return 409 when trying to create a user with an existing name', async (assert) => {
    const {name} = await UserFactory.create()
    const {body} = await supertest(BASE_URL).post('/users').send({
      name,
      email: 'test@test.com',
      password: 'test'
    }).expect(409)

    assert.assert.include(body.message, 'Name already exists')
    assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
    assert.assert.equal(body.status, 409)
  })

  test('it shoud return 422 when required date is not provided', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({}).expect(422)
    assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
    assert.assert.equal(body.status, 422)
  })
  
  test('it shoud return 422 when providing an invalid email', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({
      email: 'invalid_email',
      password: 'testinger',
      name: 'John Doe'
    }).expect(422)
    assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
    assert.assert.equal(body.status, 422)
  })
 
  test('it shoud return 422 when providing an invalid password', async (assert) => {
    const {body} = await supertest(BASE_URL).post('/users').send({
      email: 'test@test.com',
      password: 'test',
      name: 'John Doe'
    }).expect(422)
    assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
    assert.assert.equal(body.status, 422)
  })

  test ("it should update an user", async (assert) => {
    const {id, password} = await UserFactory.create()
    const email = "test@test.com"

    const {body} = await supertest(BASE_URL).put(`/users/${id}`).send({
      email,
      password,
      }).expect(200)
    assert.assert.exists(body.user, 'User undefined')
    assert.assert.equal(body.user.email, email)
    assert.assert.equal(body.user.id, id)
  })

  test ("it should update the password of the user", async (assert) => {
    const user = await UserFactory.create()
    const password = "testiing"

    const {body} = await supertest(BASE_URL).put(`/users/${user.id}`).send({
      email: user.email,
      password,
      }).expect(200)
    assert.assert.exists(body.user, 'User undefined')
    assert.assert.equal(body.user.id, user.id)

    await user.refresh()
    assert.assert.isTrue(await Hash.verify(user.password, password))
  })

  test (" it should return 422 when required data is not provided", async (assert) => {
    const {id} = await UserFactory.create()

    const {body} = await supertest(BASE_URL).put(`/users/${id}`).send({}).expect(422)
     assert.assert.equal(body.code, 'BAD_REQUEST_ERROR')
     assert.assert.equal(body.status, 422)

  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
    

}) 