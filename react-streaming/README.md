## React 18 Streaming Example

React 18 introduces `renderToPipeableStream` for server-side streaming.  
Fastify requires `reply.hijack()` to allow streaming  
without prematurely locking headers or status codes.

```js
import Fastify from 'fastify'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'

const app = Fastify()

app.get('/', async(req, reply) => {
  reply.hijack()

  const stream = renderToPipeableStream(
    React.createElement('div', null, 'Hello from React streaming 👋'),
    {
      onShellReady() {
        reply.raw.setHeader('Content-Type', 'text/html; charset=utf-8')
        stream.pipe()
      },
      onError(err) {
        reply.raw.statusCode = 500
        console.error(err)
      }
    }
  )
})

await app.listen({ port: 3000 })
```
