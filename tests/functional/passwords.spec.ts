import { test } from '@japa/runner';
import Database from '@ioc:Adonis/Lucid/Database';
import supertest from 'supertest';
import { UserFactory } from 'Database/factories';
import { assert } from '@japa/preset-adonis';
import Hash from '@ioc:Adonis/Core/Hash';
import User from 'App/Models/User';



const BASE_URL = `Http://${process.env.HOST}:${process.env.PORT}`;

test.group('Password', (group) => {
  test('it sould send and email with forgot passwod instructions', async (assert) => {
            const user = await UserFactory.create()
            await supertest(BASE_URL).post('/forgot-password').send({
               email: user.email,
               resetPasswordUrl: 'url' }).expect(204)
        }
    ).pin()

    group.each.setup(async () => {
        await Database.beginGlobalTransaction()
        return () => Database.rollbackGlobalTransaction()
      })
})