const faker = require('faker');

const { file } = require('../../../../src/db/names');

const persisted = {

    [file.modelName]: [

        // 0: sample random file
        {
            originalname: faker.system.fileName(),
            mimetype: faker.system.mimeType()
        }

    ]

};

module.exports = persisted;