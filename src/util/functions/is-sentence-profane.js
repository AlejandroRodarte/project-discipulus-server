const { badWordsFilter } = require('../filter');

const isSentenceProfane = (sentence) => {
    return sentence.split(' ').some(word => badWordsFilter.filter.isProfane(word));
};

module.exports = isSentenceProfane;
