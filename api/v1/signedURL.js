/* @flow */
'use strict'

/* ::
import type {BmGetRequest} from '../../types.js'
*/

/* ::
import type {BmPutRequest} from '../../types.js'
*/

/* ::
import type {BmResponse} from '../../types.js'
*/
const Boom = require('boom')
const dotenv = require('dotenv')

const s3urls = require('../../lib/s3-urls.js')

dotenv.config()

module.exports.get = function get (
    request /* : BmGetRequest */
) /* : Promise<BmResponse> */ {
    // return signed urls for putting and later retrieving the blob
  return s3urls()
        .catch((err) => {
          console.log('Error calling S3 to retrieve signed URLs: ' + err)
          throw Boom.badImplementation('Error calling S3 to retrieve signed URLs: ' + err)
        })
}

module.exports.put = function put (
  request /* : BmPutRequest */
) /* : Promise<BmResponse> */ {
  // validate input
  if (!request.url.params.id) {
    console.log('id not provied in request')
    throw Boom.badRequest('Please provide id', 'id')
  }

  // return signed urls for putting and later retrieving the blob with the passed in id
  return s3urls(request.url.params.id)
        .catch((err) => {
          console.log('Error calling S3 to retrieve signed URLs: ' + err)
          throw Boom.badImplementation('Error calling S3 to retrieve signed URLs: ' + err)
        })
}
