const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedParentNotes = persisted[db.names.parentNote.modelName];

const parentNotes = [
    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as parent with note that has same title as parentNote[0]
        { 
            note: {
                ...models.generateFakeNote(),
                title: persistedParentNotes[0].note.title
            }
        },

        // 1. user[0] as parent with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.parentNote.modelName]: parentNotes
};
