'use strict'

const assert = require('node:assert/strict')
const { after, test } = require('node:test')
const { instance } = require('../dist/typescript-decorators')

after(() => instance.close())

test('Controller hook should change X-Powered-By header', async () => {
  const { headers } = await instance.inject({
    url: '/main/',
    method: 'GET'
  })

  assert.equal(headers['x-powered-by'], 'Apache')
})

test('Controller should keep state', async () => {
  const firstGetResponse = await instance.inject({
    url: '/main/',
    method: 'GET'
  })

  assert.equal(firstGetResponse.payload, '{"message":""}')

  const postResponse = await instance.inject({
    url: '/main/',
    method: 'POST',
    payload: { message: 'test' }
  })

  assert.equal(postResponse.payload, '{"message":"OK"}')

  const secondGetResponse = await instance.inject({
    url: '/main/',
    method: 'GET'
  })

  assert.equal(secondGetResponse.payload, '{"message":"test"}')
})
