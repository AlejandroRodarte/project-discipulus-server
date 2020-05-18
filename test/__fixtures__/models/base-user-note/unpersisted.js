const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedUserNotes = persisted[db.names.userNote.modelName];

const userNotes = [

    // 0. anonymous user with note
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    // 1. user[1] (disabled) with note
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 2. user[0] (enabled) with note that has same title as userNote[0], owned by user[0]
        { 
            note: {
                ...models.generateFakeNote(),
                title: persistedUserNotes[0].note.title
            }
        },

        // 3. user[0] (enabled) with unique user note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.userNote.modelName]: userNotes
};
