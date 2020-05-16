const lorem = require('../../util/lorem');

const generateFakeNote = ({ 
    titleWords = 5, 
    descriptionWords = 10, 
    markdown = '# Bruh moment' 
}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    markdown
});

module.exports = generateFakeNote;
