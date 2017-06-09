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

const test = require('tape')
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
  api.post(request)
  .then((res) => {
    console.log('In promise then: ', res)
    t.equal(res.putUrl, 'www.puturl.com')
  })

  td.reset()
  process.env.S3_BUCKET = ''
  t.end()
})
