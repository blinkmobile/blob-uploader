/* @flow */
'use strict'

const AWS = require('aws-sdk')
const ensureEnvVariable = require('./ensure-env-var.js')

function retrieveS3Urls (blobName /* : string */) {
  const s3 = new AWS.S3()

  const params = {
    Bucket: ensureEnvVariable('S3_BUCKET'),
    Key: blobName,
    Expires: 86400 // 60s*60m*24h - set expiry for 24 hours
  }

  return Promise.all([
    retrieveGetUrl(s3, params),
    retrievePutUrl(s3, params)
  ]).then(result => {
    var BmResponse /*: BmResponse */ = {
      getUrl: result[0],
      putUrl: result[1]
    }
    return BmResponse
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

module.exports = retrieveS3Urls
