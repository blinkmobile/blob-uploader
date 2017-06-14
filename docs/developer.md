# How it works

Runs as  BlinkMobile ServerCLI project(https://github.com/blinkmobile/server-cli) under AWS Lambda.

When the API is called, the url query string may include an id which will be used as the key to the S3 object within the configured S3 bucket, if no id is provided a new id will be allocated.

The API supports two usages:
1. Called via HTTP POST - this will allocated a new id to be used as the S3 object key and return a put URL with a 1 hour expiry
1. Called via HTTP PUT - The request must include the id as a parameter in the URL, this id will be used as the S3 object key and optionally specify the expiry seconds(default is 1 hour). This usage is intended for getting URL's at a later time for files previously uploaded to S3

The service will return signed URL's via the AWS Node SDK (see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property) which have the same permissions level to S3 as the AWS Lambda execution role to S3, the URL's can be used to HTTP PUT Binary content (i.e. a file) and to retrieve the file via a HTTP GET.
