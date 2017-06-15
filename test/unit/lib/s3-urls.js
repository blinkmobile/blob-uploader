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

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.puturl()

  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  result.then((urls) => {
    t.equal(urls.putUrl, 'www.puturl.com')
    t.assert(urls.id.length > 0)
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  }).catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  })
})

test('Returns geturl when id passed in', (t) => {
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

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

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

  result.then((urls) => {
    t.equal(urls.getUrl, 'www.geturl.com')
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  }).catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  })
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

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.geturl('sdsds')

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            td.matchers.anything(),
            td.matchers.anything()
        )
    )

  result.then((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  }).catch((err) => {
    t.equal(err, 'S3 is down')
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  })
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

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const result = retrieveS3Urls.puturl()

  td.verify(
        aws.prototype.getSignedUrl(
            'putObject',
            td.matchers.anything()
            , td.matchers.anything()
        )
    )

  result.then((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  }).catch((err) => {
    t.equal(err, 'S3 is down')
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  })
})

test('Uses specified expiry time when passed in', (t) => {
  const params = {
    Bucket: 'testbucket',
    Key: 'dfosdkjfsdfj',
    Expires: 1000
  }

  const aws = td.replace('aws-sdk').S3
  td.when(
        aws.prototype.getSignedUrl(
            'getObject',
            params
        )
    ).thenCallback(
        null,
        'www.geturl.com'
    )

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const id = 'dfosdkjfsdfj'
  const expirySeconds = 1000
  const result = retrieveS3Urls.geturl(id, expirySeconds)

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            params,
            td.matchers.anything()
        )
    )

  result.then((urls) => {
    t.equal(urls.getUrl, 'www.geturl.com')
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  }).catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  })
})

test('Uses default expiry time when expiry not passed in', (t) => {
  const params = {
    Bucket: 'testbucket',
    Key: 'dfosdkjfsdfj',
    Expires: 3600
  }

  const aws = td.replace('aws-sdk').S3
  td.when(
        aws.prototype.getSignedUrl(
            'getObject',
            params
        )
    ).thenCallback(
        null,
        'www.geturl.com'
    )

  const retrieveS3Urls = require('../../../lib/s3-urls.js')

  process.env.S3_BUCKET = 'testbucket'
  const id = 'dfosdkjfsdfj'
  const result = retrieveS3Urls.geturl(id)

  td.verify(
        aws.prototype.getSignedUrl(
            'getObject',
            params,
            td.matchers.anything()
        )
    )

  result.then((urls) => {
    t.equal(urls.getUrl, 'www.geturl.com')
    td.reset()
    process.env.S3_BUCKET = ''
    t.end()
  }).catch((err) => {
    console.log(err)
    t.fail('Test should have succeeded')
  })
})
