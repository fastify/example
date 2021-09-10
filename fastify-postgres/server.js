"use strict";

const fastify = require("fastify");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public";

function build(opts = {}) {
  const app = fastify(opts);

  app.register(require("fastify-postgres"), { connectionString });

  app.get("/", async (_request, reply) => {
    try {
      const client = await app.pg.connect();
      const { rows } = await client.query("SELECT * FROM books");
      client.release();
      reply.send(rows);
    } catch (error) {
      reply.code(500).send(error.message);
    }
  });

  app.post("/", async (request, reply) => {
    try {
      const { body } = request;
      const client = await app.pg.connect();
      const { rows } = await client.query(
        "INSERT INTO books (title) VALUES ($1) RETURNING *",
        [body.title]
      );
      client.release();
      reply.send(rows);
    } catch (error) {
      reply.code(500).send(error.message);
    }
  });

  app.get("/:id", async (request, reply) => {
    try {
      const { params } = request;
      const client = await app.pg.connect();
      const { rows } = await client.query("SELECT * FROM books WHERE id = $1", [
        +params.id,
      ]);
      client.release();
      reply.send(rows);
    } catch (error) {
      reply.code(500).send(error.message);
    }
  });

  app.patch("/:id", async (request, reply) => {
    const { params, body } = request;
    try {
      const data = await app.pg.transact(async (client) => {
        await client.query("UPDATE books SET title = $1 WHERE id = $2", [
          body.title,
          +params.id,
        ]);
        const { rows } = await client.query(
          "SELECT * FROM books WHERE id = $1",
          [+params.id]
        );
        return rows;
      });
      reply.send(data);
    } catch (error) {
      reply.code(500).send(error.message);
    }
  });

  app.delete("/:id", async (request, reply) => {
    try {
      const { params } = request;
      const client = await app.pg.connect();
      const data = await client.query("DELETE FROM books WHERE id = $1", [
        +params.id,
      ]);
      client.release();
      reply.send(data);
    } catch (error) {
      reply.code(500).send(error.message);
    }
  });

  return app;
}

module.exports = build;
