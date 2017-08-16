# Deployment
This project is a AWS Lambda function that must be deployed with [BlinkMobile's ServerCLI](https://github.com/blinkmobile/server-cli).

## Environment variables

| Key                                | Default   | Description                                                         |
|------------------------------------|-----------|---------------------------------------------------------------------|
| S3_BUCKET                          |           | S3 bucket to be used for storing blobs                              |
| ASSUMING_ARN                       |           | The ARN of the role to assume when generating temporary credentials |

## AWS Permissions
Once deployed, the Lambda function needs to have an execution role with both get object and put object permissions to the S3 bucket. This is an example policy:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "Stmt1496618394000",
            "Effect": "Allow",
            "Action": [
                    "s3:GetObject",
                    "s3:PutObject"
                ],
                "Resource": [ "arn:aws:s3:::s3-bucket-name/*" ] }
    ]
}
```

The S3 bucket will also need to have the following CORS configuration:
```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedMethod>GET</AllowedMethod>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
    <AllowedHeader>*</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

Additional the assumed role of the lambda when being executed (e.g arn:aws:sts::905283649950:assumed-role/ServerCLI-lambda-execution/bm-blob-uploader-api-blinkm-io-dev) will need to be a trusted entity for the role being assumed for temporary credentials
