const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, studentNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedStudentNotes = persisted[studentNote.modelName];

const studentNotes = [

    // 0. unknown user with student note
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    // 1. user[1] (disabled student) with student note
    ...utilFunctions.generateOneToMany('user', persistedUsers[1]._id, [{ note: modelFunctions.generateFakeNote() }]),

    // 2. user[2] (enabled teacher) with student note
    ...utilFunctions.generateOneToMany('user', persistedUsers[2]._id, [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 3. user[0] (enabled student) with note that has same title as studentNote[0] owned by user[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedStudentNotes[0].note.title
            }
        },

        // 3. user[0] (enabled student) with unique note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [studentNote.modelName]: studentNotes
};
