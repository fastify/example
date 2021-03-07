const fastify = require("fastify");

function build(opts = {}) {
  const app = fastify(opts);
  app.get("/", async function (request, reply) {
    return { Test: "Tests" };
  });

  app.post("/:id", async function (request, reply) {
    return { id: id };
  });
  return app;
}

module.exports = build;
