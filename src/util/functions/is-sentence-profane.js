const { badWordsFilter } = require('../filter/bad-words-filter');

const isSentenceProfane = (sentence) => {
    return sentence.split(' ').some(word => badWordsFilter.isProfane(word));
};

module.exports = isSentenceProfane;
