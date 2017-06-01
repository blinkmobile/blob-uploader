/* @flow */
'use strict'

/* ::
import type {BmRequest} from '../../../types.js'
*/

const test = require('blue-tape')
const boom = require('boom')
const api = require('../../../api/v1/signedURL.js')

test('Should throw boom error if blobname not provided', (t) => {
  t.plan(1)
  const request /*: BmRequest */= {
    body: '',
    url: {
      host: 'www.test.com',
      hostname: 'test',
      pathname: '/api/signedURL',
      protocol: 'https:',
      query: {
        blobName: ''
      }
    }
  }

  try {
    api.get(request)
  } catch (err) {
    t.deepEqual(err, boom.badRequest('Please provide blobname', 'blobname'))
  }
})

// test('Should succeed with a valid request', (t) => {
//     t.plan(1)
//     var request /*:BmRequest */= {
//         body: '',
//         url : {
//             host: 'www.test.com',
//             hostname: 'test',
//             pathname: '/api/signedURL',
//             protocol: 'https:',
//             query: {
//                 blobName: 'testblob'
//             }
//         }
//     }

//     return api.get(request)
// })
