const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedTeacherNotes = persisted[db.names.teacherNote.modelName];

const teacherNotes = [

    // 0. unknown user with teacher note
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    // 1. user[1] (disabled teacher) with teacher note
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ note: models.generateFakeNote() }]),

    // 2. user[2] (enabled parent) with teacher note
    ...util.generateOneToMany('user', persistedUsers[2]._id, [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 3. user[0] (enabled teacher) with note that has same title as teacherNote[0] owned by user[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedTeacherNotes[0].note.title
            }
        },

        // 3. user[0] (enabled teacher) with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.teacherNote.modelName]: teacherNotes
};
