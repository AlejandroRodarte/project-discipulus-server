const fs = require('fs');

const { storage } = require('../../../../src/api');

const { values } = require('../../config');

const init = (persistedContext) => async () => {

    for (const bucketKey in persistedContext) {

        for (const file of persistedContext[bucketKey]) {

            const buffer = fs.readFileSync(`${values.BASE_ASSETS_PATH}/${file.originalname}`);

            await storage.createMultipartObject(storage.config.bucketNames[bucketKey], {
                keyname: file.keyname,
                buffer,
                size: buffer.length,
                mimetype: file.mimetype
            });

        }

    }

};

module.exports = init;
