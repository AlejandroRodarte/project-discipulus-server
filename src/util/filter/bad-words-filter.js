const Filter = require('bad-words');

const badWordsFilter = new Filter();

badWordsFilter.removeWords('Gaylord', 'Willy', 'Fanny', 'sexy', 'pula')

const includesProfaneWord = word => badWordsFilter.list.some(badWord => word.toLowerCase().includes(badWord.toLowerCase()));

module.exports = {
    badWordsFilter,
    utils: {
        includesProfaneWord
    }
};
