# blob-uploader
S3 Blob uploader URL service

## What is this?
Simple API using BlinkMobiles ServerCLI/AWS Lambda to allow a web client to retrieve secure URL's for uploading and retrieving content from AWS S3 without requiring access to AWS credentials

## Usage
To run the API, use the BlinkMobile Server CLI(https://github.com/blinkmobile/server-cli) to either publish the API to AWS Lambda

Send a HTTP GET request to /api/v1/signedURL?blobName={} where {} is the key to be used, if successful, this will return a JSON response with a getURL and postURL to S3