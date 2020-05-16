const { user, userNote } = require('../../../../src/db/names');

const modelFunctions = require('../../../__fixtures__/functions/models');
const utilFunctions = require('../../../__fixtures__/functions/util');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedUserNotes = persisted[userNote.modelName];

const userNotes = [
    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] with note that has same title as userNote[0]
        { 
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedUserNotes[0].note.title
            }
        },

        // 1. user[0] with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [userNote.modelName]: userNotes
};
