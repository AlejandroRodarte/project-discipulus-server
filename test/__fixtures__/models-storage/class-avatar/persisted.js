const { Types } = require('mongoose');

const { generateFakeClass } = require('../../functions/models');
const generateOneToMany = require('../../../__fixtures__/functions/util/generate-one-to-many');

const attachKeynames = require('../../functions/util/attach-keynames');

const sampleFiles = require('../../shared/sample-files');
const { class: clazz } = require('../../../../src/db/names');

const userId = new Types.ObjectId();

const classes = [

    // 0. sample class
    ...generateOneToMany('user', userId, [
        generateFakeClass({
            titleWords: 5,
            descriptionWords: 12,
            noAvatar: true,
            sessions: [[0, 20]]
        })
    ]),

    // 1. sample class
    ...generateOneToMany('user', userId, [
        generateFakeClass({
            titleWords: 8,
            descriptionWords: 15,
            noAvatar: true,
            sessions: [[10, 40]]
        })
    ])

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
