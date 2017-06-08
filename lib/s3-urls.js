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

module.exports.puturl = function retrieveS3PutUrl () /* : any */ {
  const s3 = new AWS.S3()
  let uuid = uuidV4()

  const params = {
    Bucket: ensureEnvVariable('S3_BUCKET'),
    Key: uuid,
    Expires: 3600 // 60s*60m - set expiry for 1 hour
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
  expirySeconds /* :?number */) /* : any */ {
  const s3 = new AWS.S3()

  const params = {
    Bucket: ensureEnvVariable('S3_BUCKET'),
    key: id,
    Expires: (expirySeconds || 3600)
  }

  return retrieveGetUrl(s3, params)
    .then((result) => {
      const BmPutResponse /* BmPutResponse */ = {
        getUrl: result
      }
      return BmPutResponse
    })
}

function retrieveGetUrl (s3, params) {
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

function retrievePutUrl (s3, params) {
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
