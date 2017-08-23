# How it works

Runs as  BlinkMobile [ServerCLI project](https://github.com/blinkmobile/server-cli) under AWS Lambda.

The API supports the following usage flow:

1.  Call via HTTP POST - This will allocate a id that will be used as the S3 object key and return a put URL with a 1 hour expiry to allow a client to do a HTTP PUT with a file as the body to S3 directly.
OR
1.  Call via HTTP GET - This will allocate a id that will be used as the S3 object key and return temporary credentials that can be used with the S3 SDK for the putObject or upload functions

1.  Call via HTTP PUT - The request must include the id as a parameter in the URL path, this id will be used as the S3 object key and the request can also optionally specify the expiry seconds(default is 1 hour) in the query string. This usage is intended for retrieving a HTTP GET URL to a file previously uploaded to S3 using the above operation.

The service will return signed URL's via the [AWS Node SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property) which have the same permissions level to S3 as the AWS Lambda execution role to S3, the URL's can be used to HTTP PUT Binary content (i.e. a file) and to retrieve the file via a HTTP GET.

The service will return temporary credentials via the [AWS Node SDK](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#assumeRole-property) which will only have permission's for putObject and AbortMultipartUpload operations
