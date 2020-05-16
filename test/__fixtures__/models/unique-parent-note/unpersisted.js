const { user, parentNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedParentNotes = persisted[parentNote.modelName];

const parentNotes = [
    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 0. user[0] as parent with note that has same title as parentNote[0]
        { 
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedParentNotes[0].note.title
            }
        },

        // 1. user[0] as parent with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [parentNote.modelName]: parentNotes
};
