/* @flow */
'use strict'

/* ::
import type {BmPostRequest} from '../../../types.js'
*/

/* ::
import type {BmPostResponse} from '../../../types.js'
*/

/* ::
import type {BmPutRequest} from '../../../types.js'
*/

/* ::
import type {BmPutResponse} from '../../../types.js'
*/

const test = require('blue-tape')
const boom = require('boom')
const td = require('testdouble')

test('Should throw bad implementation if library fails', (t) => {
  // setup stub of library
  const s3urls = td.replace('../../../lib/s3-urls.js')
  td.when(
    s3urls()
    ).thenReject('Couldnt retrieve URLs')

  const request /*: BmPostRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:'
    }
  }

  const api = require('../../../api/v1/signedURL.js')
  api.post(request)
  .catch((err) => {
    console.log('In promise catch: ' + err)
    t.deepEqual(err, boom.badImplementation('Error calling S3 to retrieve signed URLs: Couldnt retrieve URLs'))
  })

  t.end()
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

  const api = require('../../../api/v1/signedURL.js')

  try {
    api.put(request)
  } catch (err) {
    t.deepEqual(err, boom.badRequest('Please provide id', 'id'))
  }
  t.end()
})
