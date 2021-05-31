'use strict'

import { join } from 'desm'

export default async function app(app, opts) {
  app.register(import('fastify-autoload'), {
    dir: join(import.meta.url, 'routes'),
  })
}
