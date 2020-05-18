const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const { sampleFiles } = require('../../shared');

const userId = new Types.ObjectId();

const classes = [

    // 0. sample class
    ...util.generateOneToMany('user', userId, [
        models.generateFakeClass({
            titleWords: 5,
            descriptionWords: 12,
            noAvatar: true,
            sessions: [[0, 20]]
        })
    ]),

    // 1. sample class
    ...util.generateOneToMany('user', userId, [
        models.generateFakeClass({
            titleWords: 8,
            descriptionWords: 15,
            noAvatar: true,
            sessions: [[10, 40]]
        })
    ])

];

// classes[0] will have an associated avatar
classes[0].avatar = sampleFiles.jpgImage;

const classAvatars = util.attachKeynames([
    // 0. jpg image associated as avatar of classes[0]
    sampleFiles.jpgImage
]);

module.exports = {

    db: {
        [db.names.class.modelName]: classes
    },

    storage: {
        [db.names.class.modelName]: classAvatars
    }

};
