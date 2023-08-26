# example

This repository is a collection of Fastify project that can be used to understand `how-to` archive commons
problems and requirements.

Every directory is a stand alone project that you can read to undestand how it works and how it is configured.

## Projects

Here a list of the projects with a description, search in this page what you are looking for

| Project | Tags | Description |
|---------|------|-------------|
| [authentication] | `authentication` `session` | Example how to do authentication with `fastify-session` |
| [validation-messages] | `schema` `validation` | How you can customize the error messages of input schema validation |
| [winston-logger] | `logger` | Example how to use winston as a custom logger |
| [typescript decorators] | `typescript` | Example how to use typescript decorators to build application |
| [fastify postgres] | `postgres` `crud` | Simple CRUD app that show how integrate fastify with database, with 100% test coverage |
| [tests] | `tests` | Example of how to test your fastify application |


## External Projects

Here a list of external projects that could be useful to find some tips and suggestions

| Project | Tags | Description |
|---------|------|-------------|


## Contributions

PR are welcome! Consider that a project to be added to this repository needs to have:

+ A `README.md` file that exaplain the project itself
  + consider to use some [mermaid graph](https://mermaidjs.github.io)
+ Prefer a readable code, instead of concise
+ Comments on code that explain some code if there are more difficult parts
+ At least one test that show how to test the main function of the project

## License

Licensed under [MIT](./LICENSE).

[authentication]: ./fastify-session-authentication
[validation-messages]:./validation-messages/
[winston-logger]: ./winston-logger
[typescript decorators]: ./typescript-decorators
[fastify postgres]: ./fastify-postgres
