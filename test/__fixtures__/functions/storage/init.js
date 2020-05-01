const fs = require('fs');

const { createMultipartObject } = require('../../../../src/api/storage');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const basePath = 'test/__fixtures__/assets';

const init = (persistedContext) => async () => {

    for (const bucketKey in persistedContext) {

        for (const file of persistedContext[bucketKey]) {

            const buffer = fs.readFileSync(`${basePath}/${file.originalname}`);

            await createMultipartObject(bucketNames[bucketKey], {
                keyname: file.keyname,
                buffer,
                size: buffer.length,
                mimetype: file.mimetype
            });

        }

    }

};

module.exports = init;
