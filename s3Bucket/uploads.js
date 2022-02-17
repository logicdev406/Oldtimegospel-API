const AWS = require('aws-sdk');
const { s3Bucket } = require('../config/config');

// s3Bucket access key and secret
const s3 = new AWS.S3({
  region: s3Bucket.s3BucketRegion,
  accessKeyId: s3Bucket.s3AccessKeyId,
  secretAccessKey: s3Bucket.s3SecretAccessKey
});

const uploadImage = (filename, bucketname, file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: bucketname,
      Body: file,
      ContentType: 'image/jpeg',
      ACL: 'public-read'
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err.message || err.body);
      } else {
        resolve(data.Location);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};

// audio upload to s3 bucket function
const uploadAudio = (filename, bucketname, file) => {
  return new Promise((resolve, reject) => {
    const params = {
      Key: filename,
      Bucket: bucketname,
      Body: file,
      ContentType: 'audio/mpeg',
      ACL: 'public-read'
    };

    s3.upload(params, (err, data) => {
      if (err) {
        reject(err.message || err.body);
      } else {
        resolve(data.Location);
      }
    });
  }).catch((err) => {
    console.log(err);
  });
};

module.exports = { uploadAudio, uploadImage };
