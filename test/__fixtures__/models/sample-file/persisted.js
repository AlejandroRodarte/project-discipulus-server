const faker = require('faker');
const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const persisted = {

    [db.names.sharedFile.modelName]: [

        // 0: sample random file
        {
            _id: new Types.ObjectId(),
            originalname: faker.system.fileName(),
            mimetype: faker.system.mimeType()
        }

    ]

};

module.exports = persisted;