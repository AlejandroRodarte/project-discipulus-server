const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted[db.names.user.modelName];
const persistedParentNotes = persisted[db.names.parentNote.modelName];

const parentNotes = [

    // 0. unknown user with parent note
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    // 1. user[1] (disabled parent) with parent note
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ note: models.generateFakeNote() }]),

    // 2. user[2] (enabled student) with parent note
    ...util.generateOneToMany('user', persistedUsers[2]._id, [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('user', persistedUsers[0]._id, [

        // 3. user[0] (enabled parent) with note that has same title as parentNote[0] owned by user[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedParentNotes[0].note.title
            }
        },

        // 3. user[0] (enabled parent) with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.parentNote.modelName]: parentNotes
};
