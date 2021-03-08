'use strict'

import fastify from 'fastify'

const app = fastify({
  logger: {
    prettyPrint: true,
  },
})

app.register(import('./app.js'))

app.listen(3000, (err, address) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
})
