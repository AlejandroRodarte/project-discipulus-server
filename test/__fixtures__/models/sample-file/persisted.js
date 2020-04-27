const faker = require('faker');

const { file } = require('../../../../src/db/names');

const persisted = {

    [file.modelName]: [
        {
            originalname: faker.system.fileName(),
            mimetype: faker.system.mimeType()
        }
    ]

};

module.exports = persisted;