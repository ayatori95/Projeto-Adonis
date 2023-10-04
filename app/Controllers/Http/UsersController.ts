import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUser from 'App/Validators/CreateUserValidator'

export default class UsersController {
    public async store({ request, response }: HttpContextContract) {
        const userPayload = await request.validate(CreateUser)

        const userByEmail = await User.findBy('email', userPayload.email)
        const userByName = await User.findBy('name', userPayload.name)
        if (userByName) {
            throw new BadRequestException('Name already exists', 409)
        }
        if (userByEmail) {
            throw new BadRequestException('Email already exists', 409)
        }
        const user = await User.create(userPayload)
        return response.created({ user })
    }

    public async update({ request, response}: HttpContextContract) {
        return response.ok({})
    }
}
