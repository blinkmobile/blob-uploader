/* @flow */
'use strict'

const test = require('blue-tape')
const td = require('testdouble')

test('Should succeed when passed valid input', (t) => {
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

  td.when(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything()
        )
    ).thenCallback(
        null,
        'www.puturl.com'
    )

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls('blobTest')

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )
  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  td.reset()
  process.env.S3_BUCKET = ''

  return result // verify values of result
})

test('Should failed when geturl fails', (t) => {
  const aws = td.replace('aws-sdk').S3
  td.when(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything()
        )
    ).thenCallback(
        'S3 is down',
        ''
    )
  td.when(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything()
        )
    ).thenCallback(
        null,
        'www.puturl.com'
    )

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls('blobTest')

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )
  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  td.reset()
  process.env.S3_BUCKET = ''
  return t.shouldReject(result)
})

test('Should failed when puturl fails', (t) => {
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
  td.when(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything()
        )
    ).thenCallback(
        'S3 is down',
        ''
    )

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls('blobTest')

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )
  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything()
            , td.matchers.anything()
        )
    )

  td.reset()
  process.env.S3_BUCKET = ''
  return t.shouldReject(result)
})
