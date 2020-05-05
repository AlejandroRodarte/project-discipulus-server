const { LoremIpsum } = require('lorem-ipsum');

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 6,
        min: 3
    },
    wordsPerSentence: {
        max: 12,
        min: 4
    }
});

module.exports = lorem;
