import Fastify from 'fastify'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'

const app = Fastify()

app.get('/', (req, reply) => {
  reply.hijack()

  const stream = renderToPipeableStream(
    React.createElement('div', null, 'Hello from React streaming 👋'),
    {
      onShellReady () {
        reply.raw.setHeader('Content-Type', 'text/html; charset=utf-8')
        stream.pipe(reply.raw)
      },
      onError (err) {
        console.error(err)
      }
    }
  )
})

await app.listen({ port: 3000 })
console.log('Server running on http://localhost:3000')
