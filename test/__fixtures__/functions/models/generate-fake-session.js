const { lorem } = require('../../util');

const generateFakseSession = ({
    titleWords = 5,
    descriptionWords = 10
} = {}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords)
});

module.exports = generateFakseSession;
