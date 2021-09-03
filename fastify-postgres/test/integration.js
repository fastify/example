const tap = require("tap");
const fastify = require("../server");

tap.test("coba", async (t) => {
  const app = await fastify();
  t.test("should success create books", async (t) => {
    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: {
        title: "Hello,World!",
      },
    });
    t.equal(response.statusCode, 200);
  });

  t.test("should success create books", async (t) => {
    const app = await fastify();
    t.mock("../db.js", {
      "../query.js": {
        create: () => new Error(),
      },
    });
    const response = await app.inject({
      method: "POST",
      url: "/",
      payload: {
        title: "Hello,World!",
      },
    });
    t.equal(response.statusCode, 500);
    // call app close on last test child to close app and db properly
    app.close();
  });
});
