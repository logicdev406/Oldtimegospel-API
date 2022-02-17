const AWS = require('aws-sdk');
const { s3Bucket } = require('../config/config');

// s3Bucket access key and secret
const s3 = new AWS.S3({
  region: s3Bucket.s3BucketRegion,
  accessKeyId: s3Bucket.s3AccessKeyId,
  secretAccessKey: s3Bucket.s3SecretAccessKey
});

const fetchObject = (fileKey, bucketname) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: fileKey,
      Bucket: bucketname
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err.message || err.body);
      } else {
        resolve(data);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = { fetchObject };
