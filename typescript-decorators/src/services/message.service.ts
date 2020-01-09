import { Service } from 'fastify-decorators';

@Service()
export class MessageService {
    // Field to store and read message
    private _message: string = ''

    public get message(): string {
        return this._message
    }

    public set message(value: string) {
        this._message = value
    }
}
