const db = require("./db");

async function migration() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS books (
      id serial PRIMARY KEY,
      title varchar (255) NOT NULL
    )
  `);
}

async function getAll() {
  return await db.query("SELECT * FROM books");
}

async function create(title) {
  return await db.query("INSERT INTO books (title) VALUES ($1) RETURNING *", [
    title,
  ]);
}

async function getById(id) {
  return await db.query("SELECT * FROM books WHERE id = $1", [id]);
}

async function update(id, title) {
  await db.query("UPDATE books SET title = $1 WHERE id = $2", [title, id]);
  return await getById(id);
}

async function deleteById(id) {
  return await db.query("DELETE FROM books WHERE id = $1", [id]);
}

module.exports = { migration, getAll, getById, create, update, deleteById };
