const lorem = require('../../util/lorem');

const generateFakeEvent = ({ titleWords, descriptionWords, start, end, before }) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    timerange: {
        start,
        end
    },
    before
});

module.exports = generateFakeEvent;
