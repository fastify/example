import fastify from 'fastify'
import { bootstrap } from 'fastify-decorators'
import { join } from 'path'

const instance = fastify()

// Controllers directory path
const controllersDirectory = join(__dirname, `controllers`)

// Mask to determine controllers
const controllersMask = /\.controller\./

// Register bootstrap to autoload all handlers
instance.register(bootstrap, {
    controllersDirectory,
    controllersMask
})

export { instance }
