const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, userNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedUserNotes = persisted[userNote.modelName];

const userNotes = [

    // 0. anonymous user with note
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    // 1. user[1] (disabled) with note
    ...utilFunctions.generateOneToMany('user', persistedUsers[1]._id, [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 2. user[0] (enabled) with note that has same title as userNote[0], owned by user[0]
        { 
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedUserNotes[0].note.title
            }
        },

        // 3. user[0] (enabled) with unique user note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [userNote.modelName]: userNotes
};
