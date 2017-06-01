# blob-uploader
S3 Blob uploader URL service

## What is this?
Simple API to allow a web client to retrieve secure URL's for uploading and retrieving content from AWS S3 without requiring access to a secret key

## Setup
Set process.env.S3_BUCKET to the name of the S3 bucket to be used (alternatively create a .env file as per 'dotenv')

## Usage
Send a HTTP GET request to /api/v1/signedURL?blobName={} where {} is the key to be used, if successful, this will return a JSON response with a getURL and postURL 