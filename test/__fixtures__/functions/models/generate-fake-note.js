const lorem = require('../../util/lorem');

const generateFakeNote = ({ titleWords, descriptionWords, markdown }) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    markdown
});

module.exports = generateFakeNote;
