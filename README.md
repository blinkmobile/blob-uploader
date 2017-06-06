# blob-uploader
S3 Blob uploader URL service

## What is this?
It is a HTTP Rest API using BlinkMobile's ServerCLI ran on AWS Lambda to allow a web client to retrieve secure URL's for uploading and retrieving content from AWS S3 without requiring access to AWS credentials

Used to allow large file uploads as part of the Forms Submission service

## Usage
Send a HTTP GET request to https://[hostname]/v1/signedURL?blobName=BLOBNAME where BLOBNAME is the key that will be used to generate unique URL's to the blob.

On success, returns a JSON response with a getURL and postURL to S3