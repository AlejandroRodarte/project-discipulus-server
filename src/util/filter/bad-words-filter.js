const Filter = require('bad-words');

const filter = new Filter();

filter.removeWords('Gaylord', 'Willy', 'Fanny', 'sexy', 'pula')

const includesProfaneWord = word => filter.list.some(badWord => word.toLowerCase().includes(badWord.toLowerCase()));

module.exports = {
    filter,
    utils: {
        includesProfaneWord
    }
};
