/* @flow */
'use strict'

/* ::
import type {BmPostRequest} from '../../types.js'
*/

/* ::
import type {BmPostResponse} from '../../types.js'
*/

/* ::
import type {BmPutRequest} from '../../types.js'
*/

/* ::
import type {BmPutResponse} from '../../types.js'
*/

const test = require('blue-tape')
const td = require('testdouble')

test('API should return put url and id when post request sent', (t) => {
  process.env.S3_BUCKET = 'testbucket'
  // setup aws stub
  const aws = td.replace('aws-sdk').S3
  td.when(
    aws.prototype.getSignedUrl(
      'putObject',
      td.matchers.anything()
    )
  ).thenCallback(
    null,
    'www.puturl.com'
  )

  const request /*: BmPostRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:'
    }
  }

  const api = require('../../api/v1/signedURL.js')
  const promise = api.post(request)

  promise.then((res) => {
    console.log('In API POST promise then: ', res)
    t.equal(res.putUrl, 'www.puturl.com')
    td.reset()
    process.env.S3_BUCKET = ''
    Object.keys(require.cache).forEach((key) => { delete require.cache[key] }) // Clear require cache so future tests reload/inject dependencies
    t.end()
  })
    .catch((err) => {
      console.log(err)
      t.fail('Test should have succeeded')
      td.reset()
      process.env.S3_BUCKET = ''
      Object.keys(require.cache).forEach((key) => { delete require.cache[key] }) // Clear require cache so future tests reload/inject dependencies
    })
})

test('API should return get url when put request sent', (t) => {
  console.log('At start of API should return get url when put request sent')
  process.env.S3_BUCKET = 'testbucket'
  // setup aws stub
  const aws = td.replace('aws-sdk').S3
  td.when(
    aws.prototype.getSignedUrl(
      'getObject',
      td.matchers.anything()
    )
  ).thenCallback(
    null,
    'www.geturl.com'
  )

  const request /*: BmPutRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      params: {
        id: 'abc'
      },
      query: {}
    }
  }

  const api = require('../../api/v1/signedURL.js')
  console.log('API should return get url when put request sent - calling api.put')
  const promise = api.put(request)

  console.log('At end of API should return get url when put request sent')
  promise.then((res) => {
    console.log('In API PUT promise then: ', res)
    t.equal(res.getUrl, 'www.geturl.com')
    td.reset()
    process.env.S3_BUCKET = ''
    Object.keys(require.cache).forEach((key) => { delete require.cache[key] }) // Clear require cache so future tests reload/inject dependencies
    t.end()
  })
    .catch((err) => {
      console.log(err)
      t.fail('Test should have succeeded', 'Expected promise to resolve not reject')
      td.reset()
      process.env.S3_BUCKET = ''
      Object.keys(require.cache).forEach((key) => { delete require.cache[key] }) // Clear require cache so future tests reload/inject dependencies
    })
})
