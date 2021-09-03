const fastify = require("fastify");

const {
  migration,
  getAll,
  getById,
  create,
  deleteById,
  update,
} = require("./query");
const db = require("./db");

function build(opts = {}) {
  const app = fastify(opts);

  // You should'nt run your migration everytime your app boot
  // make a script outsied of app that can be run before development
  // or before deployment
  migration();

  app.get("/", async (_request, reply) => {
    try {
      const books = await getAll();
      reply.send(books.rows);
    } catch (error) {
      reply.code(500).send({ message: "internal server error" });
    }
  });

  app.post("/", async (request, reply) => {
    try {
      const { body } = request;
      const book = await create(body.title);
      reply.send(book.rows);
    } catch (error) {
      reply.code(500).send({ message: "internal server error" });
    }
  });

  app.get("/:id", async (request, reply) => {
    try {
      const { params } = request;
      const book = await getById(+params.id);
      reply.send(book.rows);
    } catch (error) {
      reply.code(500).send({ message: "internal server error" });
    }
  });

  app.patch("/:id", async (request, reply) => {
    try {
      const { params, body } = request;
      const book = await update(params.id, body.title);
      reply.send(book.rows);
    } catch (error) {
      reply.code(500).send({ message: "internal server error" });
    }
  });

  app.delete("/:id", async (request, reply) => {
    try {
      const { params } = request;
      const book = await deleteById(params.id);
      reply.send(book);
    } catch (error) {
      reply.code(500).send({ message: "internal server error" });
    }
  });

  app.addHook("onClose", (_instance, done) => {
    db.close();
    done();
  });
  return app;
}

module.exports = build;
