# How it works

Runs as  BlinkMobile ServerCLI project(https://github.com/blinkmobile/server-cli) under AWS Lambda.

When the API is called, the url query string must include a "blobName" which will be used as the key to the S3 object within the configured S3 bucket

The service will return two signed URL's via the AWS Node SDK (see http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property) which have the same permissions level to S3 as the AWS Lambda execution role to S3, the URL's can be used to HTTP PUT Binary content (i.e. a file) and to retrieve the file via a HTTP GET.

The URL's will expire after 24 hours and can only be used for the specified object/key and configured bucket