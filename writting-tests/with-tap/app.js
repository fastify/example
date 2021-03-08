"use strict";

const fastify = require("fastify");

function build(opts = {}) {
  const app = fastify(opts);

  const pets = [
    {
      id: 1,
      name: "cat",
    },
    {
      id: 2,
      name: "dog",
    },
  ];

  app.get("/", async function (request, reply) {
    return { data: pets };
  });

  app.get("/:id", async function (request, reply) {
    const pet = pets.find((pet) => pet.id == request.params.id);

    return { data: pet };
  });

  app.post("/", async function (request, reply) {
    pets.push({
      id: pets.length + 1,
      name: request.body.name,
    });
    return request.body;
  });

  app.delete("/:id", async function (request, reply) {
    const petToRemove = pets.findIndex((pet) => pet.id == request.params.id);
    const removedObject = pets[petToRemove];
    pets.splice(petToRemove, 1);

    return removedObject;
  });

  app.put("/:id", async function (request, reply) {
    const petToUse = pets.findIndex((pet) => pet.id == request.params.id);
    const updatedObject = (pets[petToUse].name = request.body.name);

    return updatedObject;
  });

  return app;
}

module.exports = build;
