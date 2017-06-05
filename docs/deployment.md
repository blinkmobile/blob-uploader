# Deployment
This project is a AWS Lambda project that must be run/deployed via BlinkMobile's ServerCLI, see https://github.com/blinkmobile/server-cli

## Environment variables
Set process.env.S3_BUCKET to the name of the S3 bucket to be used (alternatively create a .env file as per 'dotenv')

## AWS Permissions
The execution role that the AWS Lambda is using requires both get object and put object permissions to the S3 bucket set in the environment variable.
To do this, create a new IAM policy and attach the policy to the Lambda execution role, e.g. policy:

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