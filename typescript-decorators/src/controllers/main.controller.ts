import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Controller, ControllerType, FastifyInstanceToken, GET, Hook, Inject, POST } from 'fastify-decorators'
import { IncomingMessage, ServerResponse } from 'http'
import { MessageService } from '../services/message.service';

// Define controller
@Controller({
    route: '/main', // Base URL for all controller handlers
    type: ControllerType.SINGLETON // SINGLETON is default controller type, just define it explicit
})
class MainController {
    @Inject(FastifyInstanceToken)
    private instance!: FastifyInstance

    constructor(private messageService: MessageService) {
    }

    // Creates controller's GET handler which will return message, actually parameters are not required but kept for simplicity
    @GET({url: '/'})
    public async returnLastInputValue(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {

        return { message: this.messageService.message }
    }

    // Creates controller's POST handler which will store message
    @POST({url: '/'})
    public async storeInputMessage(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {
        const value = req.body.message

        // Using Fastify instance to log that field was changed
        this.instance.log.info(`New value received: ${value}`)

        // Storing message in service
        this.messageService.message = value

        // Reply with OK
        return { message: 'OK' }
    }

    // Creates controller's hook (Fastify Hooks)
    @Hook('onSend')
    public async changeXPoweredBy(
        req: FastifyRequest<IncomingMessage>,
        reply: FastifyReply<ServerResponse>
    ) {

        reply.header('X-Powered-By', 'Apache')
    }
}

export = MainController
