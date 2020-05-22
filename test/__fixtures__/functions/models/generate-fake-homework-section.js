const { lorem } = require('../../util');

const generateFakeHomeworkSection = ({
    titleWords = 5,
    descriptionWords = 10,
    points
} = {}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    points
});

module.exports = generateFakeHomeworkSection;
