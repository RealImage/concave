const aws = require('aws-sdk');

const s3 = new aws.S3();
const sharp = require('sharp');

exports.handler = (event, _, callback) => {
  console.log(event.queryStringParameters);
  console.log(event.pathParameters);
  const bucket = process.env.BUCKET;
  const key = event.pathParameters.proxy;
  const options = event.queryStringParameters || {};
  const params = {
    Bucket: bucket,
    Key: key,
  };
  s3.getObject(params, (err, rawImageData) => {
    if (err) {
      callback(null, {
        statusCode: 404,
        headers: {},
        body: '',
      });
    } else {
      const image = sharp(rawImageData.Body);
      if (options.w) {
        image.resize(parseInt(options.w, 10), null);
      }
      if (options.blur) {
        image.blur(parseFloat(options.blur), null);
      }
      image.toBuffer((imageErr, data, info) => {
        console.log(imageErr);
        console.log(info);
        callback(null, {
          statusCode: 200,
          body: data.toString('base64'),
          isBase64Encoded: true,
          headers: {
            'Content-Type': `image/${info.format}`,
            'Cache-Control': 'public, max-age=315360000',
            'X-Aspect-Ratio': (info.width / info.height),
          },
        });
      });
    }
  });
};
