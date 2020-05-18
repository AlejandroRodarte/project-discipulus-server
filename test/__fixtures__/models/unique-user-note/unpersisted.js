const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedUserNotes = persisted[db.names.userNote.modelName];

const userNotes = [
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] with note that has same title as userNote[0]
        { 
            note: {
                ...models.generateFakeNote(),
                title: persistedUserNotes[0].note.title
            }
        },

        // 1. user[0] with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.userNote.modelName]: userNotes
};
