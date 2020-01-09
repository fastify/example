// Import reflect metadata for dependency injection mechanism
import 'reflect-metadata'

import fastify from 'fastify'
import { bootstrap } from 'fastify-decorators'

const instance = fastify()

// Register bootstrap to autoload all controllers
instance.register(bootstrap, {
    directory: __dirname, // Controllers directory path

    mask: /\.controller\./gi, // Mask to determine controllers
})

export { instance }
