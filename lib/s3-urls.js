/* @flow */
'use strict'

/* ::
import type {BmPostResponse} from '../types.js'
*/
/* ::
import type {BmPutResponse} from '../types.js'
*/

const AWS = require('aws-sdk')
const ensureEnvVariable = require('./ensure-env-var.js')
const uuidV4 = require('uuid/v4')

module.exports.puturl = function retrieveS3PutUrl () /* : Promise<BmPostResponse> */ {
  const s3 = new AWS.S3()
  let uuid = uuidV4()

  const params = {
    Bucket: ensureEnvVariable('S3_BUCKET'),
    Key: uuid,
    Expires: 3600, // 60s*60m - set expiry for 1 hour
    ContentType: 'image/png'
  }

  return retrievePutUrl(s3, params)
    .then((result) => {
      const BmPostResponse /* BmPostResponse */ = {
        putUrl: result,
        id: uuid
      }
      return BmPostResponse
    })
}

module.exports.geturl = function retrieveS3GetUrl (
  id /* :string */,
  expirySeconds /* :?number */) /* : Promise<BmPutResponse> */ {
  const s3 = new AWS.S3()

  let expiryPeriod = 3600 // Default 60s*60m  expiry for 1 hour if not provided
  if (expirySeconds) {
    expiryPeriod = parseInt(expirySeconds)
  }

  const params = {
    Bucket: ensureEnvVariable('S3_BUCKET'),
    Key: id,
    Expires: expiryPeriod
  }

  return retrieveGetUrl(s3, params)
    .then((result) => {
      const BmPutResponse /* BmPutResponse */ = {
        getUrl: result
      }
      return BmPutResponse
    })
}

function retrieveGetUrl (s3, params) /* : Promise<string> */ {
  console.log('Calling S3 SDK getObject with params: ', params)
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, function (err, url) {
      if (err) {
        console.log('Error trying to retrieve geturl: ' + err)
        reject(err)
      } else {
        console.log('Value of getObject url: ' + url)
        resolve(url)
      }
    })
  })
}

function retrievePutUrl (s3, params) /* : Promise<string> */ {
  console.log('Calling S3 SDK putObject with params: ', params)
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('putObject', params, function (err, url) {
      if (err) {
        console.log('Error trying to retrieve puturl: ' + err)
        reject(err)
      } else {
        console.log('Value of putObject url: ' + url)
        resolve(url)
      }
    })
  })
}
