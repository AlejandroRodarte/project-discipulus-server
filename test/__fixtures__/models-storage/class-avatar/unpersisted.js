const attachKeynames = require('../../functions/util/attach-keynames');

const sampleFiles = require('../../shared/sample-files');
const { class: clazz } = require('../../../../src/db/names');

const classAvatars = attachKeynames([
    
    // 0. document avatar file (invalid)
    sampleFiles.documentFile,

    // 1. png image avatar file
    sampleFiles.pngImage
    
]);

module.exports = {
    storage: {
        [clazz.modelName]: classAvatars
    }
};
