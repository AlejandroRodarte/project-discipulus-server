const faker = require('faker');

const { sharedFile } = require('../../../../src/db/names');

const persisted = {

    [sharedFile.modelName]: [

        // 0: sample random file
        {
            originalname: faker.system.fileName(),
            mimetype: faker.system.mimeType()
        }

    ]

};

module.exports = persisted;