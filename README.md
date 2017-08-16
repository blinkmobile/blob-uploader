# blinkmobile / Blob Uploader [![Travis CI Status](https://travis-ci.org/blinkmobile/blob-uploader.svg?branch=master)](https://travis-ci.org/blinkmobile/blob-uploader) [![Greenkeeper badge](https://badges.greenkeeper.io/blinkmobile/blob-uploader.svg)](https://greenkeeper.io/)
Secure S3 URL generation for file uploads.

## What is this?
Blob Uploader is an HTTP Rest API for generating unique S3 URLS. The BlinkMobile Form Submission service uses Blob Uploader to upload large files to AWS. Files are uploaded to S3 in the background prior to the actual form submission. On form submission, files are moved from S3 to their final storage location.

## Usage
You can use Blob Uploader when your hosting solution doesn't allow large file uploads ([AWS Lambda for example](http://docs.aws.amazon.com/lambda/latest/dg/limits.html)). You will need to [deploy and host the service using BlinkMobile's Server CLI](/docs/deployment.md).

Once the service is deployed and available at a live URL ("https://YOUR_HOST_NAME" for the example below), you can use it like this:

### Upload blob

1. Make an HTTP POST request to https://YOUR_HOST_NAME/v1/signedURL

You will get back a JSON packet with a PUT URL(which will expire after 1 hour) and a id eg:

```
{
"putUrl": "https://blob1.s3.amazonaws.com/blahblob?AWSAccessKeyId=AKIAIDAL6KPDH3MZAD3Q&Expires=1496814897&Signature=dOfxf9LtO7kBa6n05h0%2Bt8RCtK0%3D",
"id": "003d96d4-31a8-4740-8b3a-5106aadf9b6d"
}
```
2. Send a PUT request with your file to the "putURL"

OR

1. Make a HTTP get request to https://YOUR_HOST_NAME/v1/temporaryCredentails

You will get back a JSON packet with temporary AWS credentials for uploading to S3 for the specified bucket and key, eg:

```
{
    "credentials": {
        "AccessKeyId": "",
        "SecretAccessKey": "",
        "SessionToken": "",
        "Expiration": ""
    },
    "bucket": "",
    "id": ""
}
```
2. Use the AWS SDK functions putObject or upload to upload blob using the credentials, bucket and id(use as the key) from the previous call

### Retrieve blob
1. Make an HTTP PUT request to https://YOUR_HOST_NAME/v1/signedURL/YOUR_ID?expirySeconds=SECONDS where YOUR_ID is the id returned from the above call and SECONDS is the expiry period to use for the returned getURL, expirySeconds is optional and will default 1 hour if not provided

You will get back a JSON packet with a GET url:

```
{
"getUrl": "https://blob1.s3.amazonaws.com/blahblob?AWSAccessKeyId=AKIAIDAL6KPDH3MZAD3Q&Expires=1496814897&Signature=dOfxf9LtO7kBa6n05h0%2Bt8RCtK0%3D"
}
```

2. Retrieve your file within the expiry period using the "getURL"