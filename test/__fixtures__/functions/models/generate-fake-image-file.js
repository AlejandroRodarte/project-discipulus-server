const { Types } = require('mongoose');
const faker = require('faker');

const extensions = ['jpg', 'jpeg', 'gif', 'bmp', 'png'];

const generateFakeImageFile = () => {

    const random = Math.floor(Math.random() * extensions.length);
    const [filename] = faker.system.fileName().split('.');

    return {
        _id: new Types.ObjectId(),
        originalname: `${filename}.${extensions[random]}`,
        mimetype: `image/${extensions[random]}`
    };

};

module.exports = generateFakeImageFile;
