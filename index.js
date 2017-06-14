const aws = require('aws-sdk');
const s3 = new aws.S3();

exports.handler = (event, context, callback) => {
  console.log(event.queryStringParameters);
  console.log(event.pathParameters);
  const bucket = process.env.BUCKET;
  const key = event.pathParameters.proxy;
  const params = {
    Bucket: bucket,
    Key: key,
  };
  s3.getObject(params, (err, data) => {
    if (err) {
      callback(null, {
        statusCode: 404,
      });
    } else {
      callback(null, {
        statusCode: 200,
        body: data.Body.toString('base64'),
        isBase64Encoded: true,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
    }
  });
};
