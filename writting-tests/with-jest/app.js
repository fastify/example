const fastify = require("fastify")

function build(opts={}) {
    const app = fastify(opts)
    app.get('/',async function (request,reply) {
        return {Test:'Tests'}
    })
    return app
}


module.exports = build
