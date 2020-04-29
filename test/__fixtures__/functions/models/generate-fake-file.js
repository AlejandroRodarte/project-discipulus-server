const { Types } = require('mongoose');

const faker = require('faker');

const generateFakeFile = () => ({
    _id: new Types.ObjectId(),
    originalname: faker.system.fileName(),
    mimetype: faker.system.mimeType()
});

module.exports = generateFakeFile;