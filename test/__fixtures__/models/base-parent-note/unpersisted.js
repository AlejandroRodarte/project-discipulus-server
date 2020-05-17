const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, parentNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedParentNotes = persisted[parentNote.modelName];

const parentNotes = [

    // 0. unknown user with parent note
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    // 1. user[1] (disabled parent) with parent note
    ...utilFunctions.generateOneToMany('user', persistedUsers[1]._id, [{ note: modelFunctions.generateFakeNote() }]),

    // 2. user[2] (enabled student) with parent note
    ...utilFunctions.generateOneToMany('user', persistedUsers[2]._id, [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 3. user[0] (enabled parent) with note that has same title as parentNote[0] owned by user[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedParentNotes[0].note.title
            }
        },

        // 3. user[0] (enabled parent) with unique note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [parentNote.modelName]: parentNotes
};
