// Required to get normal stacktrace with references to source (typescript) files
require('source-map-support').install()

// Require fastify instance
const app = require('../dist/typescript-decorators').instance

// Start listening on 3000 port
app.listen(3000, (err) => {
    if (err) throw err

    console.log(`Application is ready and listening on http://localhost:3000`)
    console.log(`Available routes:`)
    console.log(app.printRoutes())
})
