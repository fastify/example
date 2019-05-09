import { instance } from '../src/typescript-decorators'

const tap = require('tap')

tap.test('Controller hook should change X-Powered-By header', async (t: any) => {
   const {headers} = await instance.inject({
        url: '/main/',
        method: 'GET'
    })

    t.match(headers, {'x-powered-by': 'Apache'})
})

tap.test(`Controller should keep state`, async (t: any) => {
    firstGetRequestShouldReturnEmptyMessage: {
        const {payload} = await instance.inject({
            url: '/main/',
            method: 'GET'
        })

        t.match(payload, `{"message":""}`)
    }

    postRequestShouldStoreMessage: {
        const {payload} = await instance.inject({
            url: '/main/',
            method: 'POST',
            payload: {message: 'test'}
        })

        t.match(payload, `{"message":"OK"}`)
    }

    secondGetRequestShouldReturnStoredMessage: {
        const {payload} = await instance.inject({
            url: '/main/',
            method: 'GET'
        })

        t.match(payload, `{"message":"test"}`)
    }
})
