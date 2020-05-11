const { generateFakeClass } = require('../../functions/models');
const attachKeynames = require('../../functions/util/attach-keynames');

const sampleFiles = require('../../shared/sample-files');
const { class: clazz } = require('../../../../src/db/names');

const classes = [

    // 0. sample class
    generateFakeClass({
        titleWords: 5,
        descriptionWords: 12,
        noAvatar: true,
        sessions: [[0, 20]]
    }),

    // 1. sample class
    generateFakeClass({
        titleWords: 8,
        descriptionWords: 15,
        noAvatar: true,
        sessions: [[10, 40]]
    }),

];

// classes[0] will have an associated avatar
classes[0].avatar = sampleFiles.jpgImage;

const classAvatars = attachKeynames([
    // 0. jpg image associated as avatar of classes[0]
    sampleFiles.jpgImage
]);

module.exports = {

    db: {
        [clazz.modelName]: classes
    },

    storage: {
        [clazz.modelName]: classAvatars
    }

};
