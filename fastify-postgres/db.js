const { Pool } = require("pg");
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public",
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  close: () => pool.end(),
};
