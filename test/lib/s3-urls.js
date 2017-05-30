/* @flow */
'use strict'

const test = require('blue-tape')
const td = require('testdouble')
const boom = require('boom')

test('Should succeed when passed valid input', (t) => {
    var aws = td.replace('aws-sdk').S3
    td.when(aws.prototype.getSignedUrl(
                    'getObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                null,
                'www.geturl.com'
            )
    td.when(aws.prototype.getSignedUrl(
                    'putObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                null,
                'www.puturl.com'
                )
    
    var lib = require('../../lib/s3-urls.js')

    process.env.S3_BUCKET = 'testbucket'
    var result = lib.retrieveS3Urls('blobTest')

    td.verify(aws.prototype.getSignedUrl('getObject',td.matchers.anything(),td.matchers.anything()))
    td.verify(aws.prototype.getSignedUrl('putObject',td.matchers.anything(),td.matchers.anything()))

    td.reset()
    process.env.S3_BUCKET = ''

    return result
})

test('Should failed when geturl fails', (t) => {
    var aws = td.replace('aws-sdk').S3
    td.when(aws.prototype.getSignedUrl(
                    'getObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                'S3 is down',
                ''
            )
    td.when(aws.prototype.getSignedUrl(
                    'putObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                null,
                'www.puturl.com'
                )
    
    var lib = require('../../lib/s3-urls.js')

    process.env.S3_BUCKET = 'testbucket'
    var result = lib.retrieveS3Urls('blobTest')

    td.verify(aws.prototype.getSignedUrl('getObject',td.matchers.anything(),td.matchers.anything()))
    td.verify(aws.prototype.getSignedUrl('putObject',td.matchers.anything(),td.matchers.anything()))

    

    td.reset()
    process.env.S3_BUCKET = ''
    return t.shouldReject(result)
})

test('Should failed when puturl fails', (t) => {
    var aws = td.replace('aws-sdk').S3
    td.when(aws.prototype.getSignedUrl(
                    'getObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                null,
                'www.geturl.com'
            )
    td.when(aws.prototype.getSignedUrl(
                    'putObject',
                    td.matchers.anything()
                )
            ).thenCallback(
                'S3 is down',
                ''
                )
    
    var lib = require('../../lib/s3-urls.js')

    process.env.S3_BUCKET = 'testbucket'
    var result = lib.retrieveS3Urls('blobTest')

    td.verify(aws.prototype.getSignedUrl('getObject',td.matchers.anything(),td.matchers.anything()))
    td.verify(aws.prototype.getSignedUrl('putObject',td.matchers.anything(),td.matchers.anything()))

    

    td.reset()
    process.env.S3_BUCKET = ''
    return t.shouldReject(result)
})
