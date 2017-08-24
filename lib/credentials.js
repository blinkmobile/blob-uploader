// @flow
'use strict'

const AWS = require('aws-sdk')
const uuidV4 = require('uuid/v4')
const path = require('path')
// $FlowFixMe
const config = require(path.join(__dirname, '..', '.blinkmrc.json')) // loading via path due to leading dot in file name

const ensureEnvVariable = require('./ensure-env-var.js')
function getTemporaryCredentials () {
  const sts = new AWS.STS({ region: config.server.region })
  const uuid = uuidV4()

  const params = {
    DurationSeconds: 3600,
    Policy: `{"Version": "2012-10-17","Statement": [{"Sid": "Stmt1496618394000","Effect": "Allow","Action": ["s3:PutObject","s3:AbortMultipartUpload"],"Resource": ["arn:aws:s3:::${ensureEnvVariable('S3_BUCKET')}/${uuid}"]}]}`,
    RoleArn: ensureEnvVariable('ASSUMING_ARN'),
    RoleSessionName: 'ClientS3Upload'
  }
  return sts.assumeRole(params)
    .promise()
    .then((data) => {
      return {
        credentials: data.Credentials,
        bucket: ensureEnvVariable('S3_BUCKET'),
        id: uuid,
        region: config.server.region
      }
    })
    .catch((err) => {
      console.log(`error assuming role: ${err}`)
      throw err
    })
}

module.exports = {
  getTemporaryCredentials
}
