const { lorem } = require('../../util');
const generateFakeImageFile = require('./generate-fake-image-file');

const generateFakeClass = ({
    titleWords = 5,
    descriptionWords = 10,
    noAvatar = false,
    timeRanges = [[0, 10]]
} = {}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    avatar: noAvatar ? undefined : generateFakeImageFile(),
    timeRanges: timeRanges.map(([start, end]) => ({ start, end }))
});

module.exports = generateFakeClass;
