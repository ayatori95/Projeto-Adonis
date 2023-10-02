import { Exception, HttpContext } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new BadRequestException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class BadRequestException extends Exception {
    public code = 'BAD_REQUEST_ERROR'

    public async handle(error: this, ctx: HttpContext) {
        ctx.response.status(error.status).send({
            code: this.code,
            message: error.message,
            status: error.status,
        })
    }
}
