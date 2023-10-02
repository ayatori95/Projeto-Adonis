import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
    public async store({ request, response }: HttpContextContract) {
        const userPayload = request.only(['name', 'email', 'password'])
        const userByEmail = await User.findBy('email', userPayload.email)
        if (userByEmail) {
            return response.conflict({massege: 'Email already exists'})
        }
        const user = await User.create(userPayload)
        return response.created({ user })
    }
}
