const AWS = require('ibm-cos-sdk');

const config = {
    endpoint: process.env.IBM_CLOUD_OBJECT_STORAGE_ENDPOINT || 'mock-endpoint',
    apiKeyId: process.env.IBM_CLOUD_OBJECT_STORAGE_API_KEY || 'mock-key',
    ibmAuthEndpoint: process.env.IBM_CLOUD_OBJECT_STORAGE_IBM_AUTH_ENDPOINT || 'mock-endpoint',
    serviceInstanceId: process.env.IBM_CLOUD_OBJECT_STORAGE_SERVICE_INSTANCE_ID || 'mock-id'
};

const cos = new AWS.S3(config);

module.exports = cos;
