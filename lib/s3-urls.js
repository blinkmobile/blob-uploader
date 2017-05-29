/* @flow */
'use strict'

var AWS = require('aws-sdk')
const Boom = require('boom')
const ensureEnvVariable = require('./ensure-env-var.js')

function retrieveS3Urls(blobName /* : string */){
    var s3 = new AWS.S3();
    
    var params = {
        Bucket: ensureEnvVariable('S3_BUCKET'),
        Key: blobName
    }; //TODO Verify what other params or options to set?

    return Promise.all([
        retrieveGetUrl(s3,params),
        retrievePutUrl(s3,params)
    ]).then(result => {
        var BmResponse /*:BmResponse */ = {
            getUrl: result[0],
            putUrl: result[1]
        }
        return BmResponse
    })
}

function retrieveGetUrl(s3,params){
    return new Promise((resolve,reject) => {
        s3.getSignedUrl('getObject', params, function(err, url){
            if (err){
                console.log('Error trying to retrieve geturl: '+err)
                reject(Boom.wrap(err));
            }
            else{
                resolve(url);
            }
        })
    })
}

function retrievePutUrl(s3,params){
    return new Promise((resolve,reject) => {
        s3.getSignedUrl('putObject', params, function(err, url){
            if (err){
                console.log('Error trying to retrieve puturl: '+err)
                reject(Boom.wrap(err));
            }
            else{
                resolve(url);
            }
        })
    })
}

module.exports.retrieveS3Urls = retrieveS3Urls