const createMultipartObject = require('./create-multipart-object');
const getMultipartObject = require('./get-multipart-object');
const listBucketKeys = require('./list-bucket-keys');
const deleteBucketObjects = require('./delete-bucket-objects');

module.exports = {
    createMultipartObject,
    getMultipartObject,
    listBucketKeys,
    deleteBucketObjects
};
