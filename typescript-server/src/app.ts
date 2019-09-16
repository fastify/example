
/**
 * Most type annotations in this file are not strictly necessary but are
 * included for this example.
 *
 * To run this example execute the following commands to install typescript,
 * transpile the code, and start the server:
 *
 */

import fastify from 'fastify'
import { createReadStream } from 'fs'
import path from 'path';
import { ServerResponse, IncomingMessage, Server} from 'http'
import { AddressInfo } from 'net';
import S from 'fluent-schema'

const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify()
const queryStringJsonSchema = S.object()
.prop('name', S.string().minLength(8))
.prop('excitement', S.integer());

const schema = {
  querystring: queryStringJsonSchema
}
console.log('scheme:', JSON.stringify(queryStringJsonSchema.valueOf(), undefined, 2));
server.get('/', {schema}, (req, reply) => {
  console.log('x:', req.query.name, req.query.excitement);
  const stream = createReadStream(path.join(__dirname,'../package.json'), 'utf8')
  reply.code(200).send(stream)
})
server.get('/stream', (req, reply) => {
  reply.header('Content-Type', 'application/json').code(200)
  reply.send({ hello: 'world' })
})

server.listen(3000, err => {
  if (err) throw err
  console.log(`server listening on ${(server.server.address()as AddressInfo).port}`)
})
