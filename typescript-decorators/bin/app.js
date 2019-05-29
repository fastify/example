// Required to get normal stacktrace with references to source (typescript) files
require('source-map-support').install()

// Require fastify instance
const app = require('../dist/typescript-decorators').instance

// Start listening on 3000 port
app.listen(3000)
