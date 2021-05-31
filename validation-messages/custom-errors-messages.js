'use strict'

const Ajv = require('ajv')
const AjvErrors = require('ajv-errors')

module.exports = function (fastify, options, next) {
  const ajv = new Ajv({ allErrors: true, jsonPointers: true })
  // enhance the ajv instance
  AjvErrors(ajv)

  // create a schema to validate the input, using the specs by the `ajv-errors` module
  const schema = {
    $id: 'hello',
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string'
      }
    },
    additionalProperties: false,
    errorMessage: 'my custom message'
  }

  fastify.get('/', {
    schema: {
      querystring: schema
    },
    validatorCompiler: ({ schema }) => {
      const validate = ajv.compile(schema)
      return validate
    }
  }, (req, res) => res.send('hello'))

  next()
}
