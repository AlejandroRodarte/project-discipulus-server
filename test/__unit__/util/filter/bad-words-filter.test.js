const expect = require('chai').expect;

const { utils } = require('../../../../src/util/filter/bad-words-filter');

describe('includesProfaneWord', () => {

    it('Should return true on texts that include profane words', () => {

        const words = [
            'Alejandro Fuck',
            'George Pussymaster',
            'cocklover69',
            'myfavorite-bitch',
            'your-anus',
            'my super sexy pdf',
            'dick-pic.png',
            'cumming.gif'
        ];

        words.forEach(word => expect(utils.includesProfaneWord(word)).to.equal(true));

    });

    it('Should return false on texts that do not include profane words', () => {

        const words = [
            'Alejandro Rodarte',
            'George Clooney',
            'Master',
            'zebra1150',
            'your-best-love',
            'ninja_sensei_68',
            'program.c',
            'execution.pdf'
        ];

        words.forEach(word => expect(utils.includesProfaneWord(word)).to.equal(false));

    });

});
