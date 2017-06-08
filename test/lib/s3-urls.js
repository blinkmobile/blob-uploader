/* @flow */
'use strict'

const test = require('blue-tape')
const td = require('testdouble')

test('Should succeed when passed valid input', (t) => {
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

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.puturl()

  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  td.reset()
  process.env.S3_BUCKET = ''

  result.then((urls) => {
    t.equal(urls.putUrl, 'www.puturl.com')
    t.assert(urls.id.length > 0)
  })

  t.end()
})

test('Returns id when id passed in', (t) => {
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

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const id = 'dfosdkjfsdfj'
  const result = retrieveS3Urls.geturl(id)

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  td.reset()
  process.env.S3_BUCKET = ''

  result.then((urls) => {
    t.equal(urls.getUrl, 'www.geturl.com')
  })

  t.end()
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

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.geturl('sdsds')

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
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
            'putObject',
            td.matchers.anything()
        )
    ).thenCallback(
        'S3 is down',
        ''
    )

  const retrieveS3Urls = require('../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.puturl()

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
