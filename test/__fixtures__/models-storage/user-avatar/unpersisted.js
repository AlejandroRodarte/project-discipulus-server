const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const userAvatars = util.attachKeynames([

    // 0. invalid avatar file
    sampleFiles.documentFile,

    // 1. valid avatar file
    sampleFiles.pngImage

]);

module.exports = {

    storage: {
        [db.names.user.modelName]: userAvatars
    }

};