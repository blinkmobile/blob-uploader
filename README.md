# Blob Uploader
Secure S3 URL generation for file uploads.

## What is this?
Blob Uploader is an HTTP Rest API for generating unique S3 URLS. The BlinkMobile Form Submission service uses Blob Uploader to upload large files to AWS. Files are uploaded to S3 in the background prior to the actual form submission. On form submission, files are moved from S3 to their final storage location.

## Usage
You can use Blob Uploader when your hosting solution doesn't allow large file uploads ([AWS Lambda for example](http://docs.aws.amazon.com/lambda/latest/dg/limits.html)). You will need to [deploy and host the service using BlinkMobile's Server CLI](/docs/deployment.md).

Once the service is deployed and available at a live URL ("https://YOUR_HOST_NAME" for the example below), you can use it like this:

[1] Make an HTTP GET request to https://YOUR_HOST_NAME/v1/signedURL?id=YOUR_UUID or https://YOUR_HOST_NAME/v1/signedURL

id is an optional parameter, if not included, an id (in uuid v4 format - https://en.wikipedia.org/wiki/Universally_unique_identifier#Version_4_.28random.29) will be allocated and returned

You will get back a JSON packet with two URLs and a id eg:

```
{
"getUrl": "https://blob1.s3.amazonaws.com/blahblob?AWSAccessKeyId=AKIAIDAL6KPDH3MZAD3Q&Expires=1496814897&Signature=Zc27tJEwOvpU%2BaUALfMOzSjkc%2F0%3D",
"putUrl": "https://blob1.s3.amazonaws.com/blahblob?AWSAccessKeyId=AKIAIDAL6KPDH3MZAD3Q&Expires=1496814897&Signature=dOfxf9LtO7kBa6n05h0%2Bt8RCtK0%3D",
"id": "003d96d4-31a8-4740-8b3a-5106aadf9b6d"
}
```
[2] Send a PUT request with your file to the "putURL"

[3] Retrieve your file later using the "getURL"

[4] Optional - Call service again passing the returned id to retrieve new URL's to the same S3 object with a new expiry time 

NOTE: The URLs will last for 24 hours. You can call Blob Uploader again, passing the same file name, to get two new URLs that will point to the same file.