const lorem = require('../../util/lorem');

const generateFakeEvent = ({ 
    titleWords = 5, 
    descriptionWords = 10, 
    start = 100, 
    end = 1000, 
    before = 100
}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    timerange: {
        start,
        end
    },
    before
});

module.exports = generateFakeEvent;
