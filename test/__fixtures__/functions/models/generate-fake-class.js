const lorem = require('../../util/lorem');
const generateFakeImageFile = require('./generate-fake-image-file');

const generateFakeClass = ({
    titleWords,
    descriptionWords,
    noAvatar = false,
    sessions
}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    avatar: noAvatar ? undefined : generateFakeImageFile(),
    sessions: sessions.map(([start, end]) => ({ start, end }))
});

module.exports = generateFakeClass;
