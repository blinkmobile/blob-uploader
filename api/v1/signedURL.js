/* @flow */
'use strict'

/* ::
import type {BmRequest} from '../../types.js'
*/

/* ::
import type {BmResponse} from '../../types.js'
*/
const Boom = require('boom')
const dotenv = require('dotenv')

const s3urls = require('../../lib/s3-urls.js')

dotenv.config()

module.exports.get = function get (
    request /* : BmRequest */
) /* : Promise<BmResponse> */ {
    // Validate input
  if (!request.url.query.blobName) {
    console.log('blobname not provied in request query string')
    throw Boom.badRequest('Please provide blobname', 'blobname')
  }

    // return signed urls for putting and later retrieving the blob
  return s3urls.retrieveS3Urls(request.url.query.blobName)
        .catch(
            function (err) {
              console.log('Error calling S3 to retrieve signed URLs: ' + err)
              throw Boom.badImplementation('Error calling S3 to retrieve signed URLs: ' + err)
            }

    )
}
