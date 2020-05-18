const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');
const { db } = require('../../../../src/shared');

const classAvatars = util.attachKeynames([
    
    // 0. document avatar file (invalid)
    sampleFiles.documentFile,

    // 1. png image avatar file
    sampleFiles.pngImage
    
]);

module.exports = {
    storage: {
        [db.names.class.modelName]: classAvatars
    }
};
