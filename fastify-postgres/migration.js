"use strict";

const Postgrator = require("postgrator");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/fastify_postgres?schema=public";

const postgrator = new Postgrator({
  connectionString: connectionString,
  migrationDirectory: __dirname + "/migrations",
  driver: "pg",
});

if (process.env.MIGRATE_ACTION === "do") {
  postgrator
    .migrate()
    .then((appliedMigrations) => console.log(appliedMigrations))
    .catch((error) => console.log(error));
}

if (process.env.MIGRATE_ACTION === "undo") {
  postgrator
    .migrate("000")
    .then((appliedMigrations) => console.log(appliedMigrations))
    .catch((error) => console.log(error));
}
