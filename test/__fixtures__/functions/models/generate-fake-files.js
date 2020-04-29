const { Types } = require('mongoose');

const faker = require('faker');

const generateFakeFiles = (amount) => {

    const fileIds = [...new Array(amount)].map(_ => new Types.ObjectId());

    const files = fileIds.map(_id => ({
        _id: new Types.ObjectId(),
        originalname: faker.system.fileName(),
        mimetype: faker.system.mimeType()
    }));

    return files;

};

module.exports = generateFakeFiles;