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
const Boom = require('boom')
const dotenv = require('dotenv')

const s3urls = require('../../lib/s3-urls.js')

dotenv.config()

module.exports.post = function post (
  request /* : BmPostRequest */
) /* : Promise<BmPostResponse> */ {
  // return signed urls for putting and later retrieving the blob
  console.log('post called with request: ', request)
  return s3urls.puturl()
    .catch((err) => {
      console.log('Error calling S3 to retrieve upload details: ' + err)
      throw Boom.badImplementation('Error calling S3 to retrieve upload details: ' + err)
    })
}

module.exports.put = function put (
  request /* : BmPutRequest */
) /* : Promise<BmPutResponse> */ {
  console.log('put called with request: ', request)
  // validate input
  if (!request.url.params.id) {
    console.log('id not provided in request')
    throw Boom.badRequest('Please provide id', 'id')
  }

  // return signed urls for putting and later retrieving the blob with the passed in id
  return s3urls.geturl(request.url.params.id, request.url.query.expirySeconds)
    .catch((err) => {
      console.log('Error calling S3 to retrieve GET URL: ' + err)
      throw Boom.badImplementation('Error calling S3 to retrieve GET URL: ' + err)
    })
}
