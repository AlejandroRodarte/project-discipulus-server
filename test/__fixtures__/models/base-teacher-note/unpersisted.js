const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { user, teacherNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted[user.modelName];
const persistedTeacherNotes = persisted[teacherNote.modelName];

const teacherNotes = [

    // 0. unknown user with teacher note
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    // 1. user[1] (disabled teacher) with teacher note
    ...utilFunctions.generateOneToMany('user', persistedUsers[1]._id, [{ note: modelFunctions.generateFakeNote() }]),

    // 2. user[2] (enabled parent) with teacher note
    ...utilFunctions.generateOneToMany('user', persistedUsers[2]._id, [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('user', persistedUsers[0]._id, [

        // 3. user[0] (enabled teacher) with note that has same title as teacherNote[0] owned by user[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedTeacherNotes[0].note.title
            }
        },

        // 3. user[0] (enabled teacher) with unique note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [teacherNote.modelName]: teacherNotes
};
