/* @flow */
'use strict'

/* ::
import type {BmPostRequest} from '../../../../types.js'
*/

/* ::
import type {BmPostResponse} from '../../../../types.js'
*/

/* ::
import type {BmPutRequest} from '../../../../types.js'
*/

/* ::
import type {BmPutResponse} from '../../../../types.js'
*/

const test = require('blue-tape')
const td = require('testdouble')

test('Should return put url', (t) => {
  // setup stub of library
  const s3urls = td.replace('../../../../lib/s3-urls.js')
  const response /*: BmPostResponse */= {
    putUrl: 'put',
    id: 'abc'
  }
  td.when(
      s3urls.puturl()
    ).thenResolve(response)

  const request /*: BmPostRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:'
    }
  }

  const api = require('../../../../api/v1/signedURL.js')
  api.post(request)
  .then((res) => {
    console.log(res)
    t.equal(res.putUrl, 'put')
    t.equal(res.id, 'abc')
    td.reset()
    t.end()
  })
  .catch((err) => {
    console.log('In promise catch: ', err)
    t.fail('Test should have succeeded')
    td.reset()
  })
})

test('Should throw bad implementation if library fails', (t) => {
  // setup stub of library
  const s3urls = td.replace('../../../../lib/s3-urls.js')
  td.when(
      s3urls.puturl()
    ).thenReject('Couldnt retrieve put URL')

  const request /*: BmPostRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:'
    }
  }

  const api = require('../../../../api/v1/signedURL.js')
  api.post(request)
  .then((res) => {
    console.log(res)
    t.fail('Test should have succeeded')
    td.reset()
  })
  .catch((err) => {
    console.log('In promise catch: ', err)
    t.equal(err.message, 'Error calling S3 to retrieve signed URLs: Couldnt retrieve put URL')
    td.reset()
    t.end()
  })
})

test('Should return geturl when id passed in', (t) => {
  // setup stub of library
  const response /*: BmPutResponse */= {
    getUrl: 'get'
  }
  const s3urls = td.replace('../../../../lib/s3-urls.js')
  td.when(
    s3urls.geturl('test123', td.matchers.anything())
  ).thenResolve(response)

  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {
        id: 'test123'
      },
      query: {}
    }
  }

  const api = require('../../../../api/v1/signedURL.js')
  api.put(request)
  .then((res) => {
    console.log('In promise then: ', res)
    t.equal(res.getUrl, 'get')
    td.reset()
    t.end()
  })
  .catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
    td.reset()
  })
})

test('Should reject when id not passed in', t => {
  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {},
      query: {}
    }
  }

  const api = require('../../../../api/v1/signedURL.js')

  try {
    api.put(request)
  } catch (err) {
    t.equal(err.message, 'Please provide id', 'id')
    t.end()
  }
})

test('Should pass through expirySeconds from request', (t) => {
  // setup stub of library
  const response /*: BmPutResponse */= {
    getUrl: 'get'
  }
  const s3urls = td.replace('../../../../lib/s3-urls.js')
  td.when(
    s3urls.geturl(
      'test123',
      1000
    )
  ).thenResolve(response)

  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {
        id: 'test123'
      },
      query: {
        expirySeconds: 1000
      }
    }
  }

  const api = require('../../../../api/v1/signedURL.js')
  api.put(request)
  .then((res) => {
    console.log('In promise then: ', res)
    t.equal(res.getUrl, 'get')
    td.reset()
    t.end()
  })
  .catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
    td.reset()
  })
})
