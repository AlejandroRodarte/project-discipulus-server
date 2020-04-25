const faker = require('faker');

const sampleFile = {
    originalname: faker.system.fileName(),
    mimetype: faker.system.mimeType()
};

module.exports = sampleFile;
