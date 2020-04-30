const AWS = require('ibm-cos-sdk');

const config = {
    endpoint: process.env.IBM_CLOUD_OBJECT_STORAGE_ENDPOINT,
    apiKeyId: process.env.IBM_CLOUD_OBJECT_STORAGE_API_KEY,
    ibmAuthEndpoint: process.env.IBM_CLOUD_OBJECT_STORAGE_IBM_AUTH_ENDPOINT,
    serviceInstanceId: process.env.IBM_CLOUD_OBJECT_STORAGE_SERVICE_INSTANCE_ID
};

module.exports = new AWS.S3(config);
