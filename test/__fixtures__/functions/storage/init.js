const fs = require('fs');

const sampleFiles = require('../../shared/sample-files');
const { createMultipartObject } = require('../../../../src/api/storage');

const bucketName = require('../../../../src/api/storage/config/bucket-names');

const basePath = 'test/__fixtures__/assets';

const init = (persistedContext) => async () => {

    for (const bucketKey in persistedContext) {

        for (const file in persistedContext[bucketKey]) {

            const buffer = fs.readFileSync(`${basePath}/${file.originalname}`);

        }

    }

};

module.exports = init;
