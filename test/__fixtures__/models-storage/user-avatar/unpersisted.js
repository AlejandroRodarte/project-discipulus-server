const attachKeynames = require('../../functions/util/attach-keynames');

const sampleFiles = require('../../shared/sample-files');
const { user } = require('../../../../src/db/names');

const userAvatars = attachKeynames([

    // 0. invalid avatar file
    sampleFiles.documentFile,

    // 1. valid avatar file
    sampleFiles.pngImage

]);

module.exports = {

    storage: {
        [user.modelName]: userAvatars
    }

};