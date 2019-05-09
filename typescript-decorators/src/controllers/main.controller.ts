import { FastifyReply, FastifyRequest } from 'fastify'
import { AbstractController, Controller, ControllerType, GET, Hook, POST } from 'fastify-decorators';
import { IncomingMessage, ServerResponse } from 'http'

// Define controller
@Controller({
    route: '/main', // Base URL for all controller handlers
    type: ControllerType.SINGLETON // SINGLETON is default controller type, just define it explicit
})
class MainController
    // It's optional. We have to extends AbstractController to have Fastify instance accessible inside.
    extends AbstractController {
    public get message(): string {
        return this._message;
    }

    public set message(value: string) {
        // Using Fastify instance to log that field was changed
        this.instance.log.info(`New value received: ${value}`);

        this._message = value;
    }

    // Field to store and read message
    private _message: string = ''

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({url: '/'})
    public async returnLastInputValue(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {

        return {message: this._message}
    }

    // Creates controller's POST handler which will store message
    @POST({url: '/'})
    public async storeInputMessage(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {
        this._message = req.body._message

        return {message: 'OK'}
    }

    // Creates controller's hook (Fastify Hooks)
    @Hook('onResponse')
    public async changeXPoweredBy(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {

        reply.header('X-Powered-By', 'Apache')
    }
}

export = MainController