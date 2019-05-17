'use strict'

const winston = require('winston')

// Create custom logger
const logger = winston.createLogger({
  // Define levels required by Fastify (by default winston has verbose level and does not have trace)
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5
  },
  // Setup log level
  level: 'info',
  // Setup logs format
  format: winston.format.json(),
  // Define transports to write logs, it could be http, file or console
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// create a fastify instance to run and specify logger
const fastify = require('fastify')({ logger })

fastify.get('/hello', (req, reply) => {
  fastify.log.info('Sending hello')

  reply.send({ greet: 'hello' })
})

fastify.setNotFoundHandler((request, reply) => {
  fastify.log.debug('Route not found: ', request.req.url)

  reply.status(404).send({ message: 'Not found' })
})

fastify.setErrorHandler((error, request, reply) => {
  fastify.log.debug(`Request url: `, request.req.url)
  fastify.log.debug(`Payload: `, request.body)
  fastify.log.error(`Error occurred: `, error)

  reply.status(500).send({ message: 'Error occurred during request' })
})

fastify.listen(3000)
