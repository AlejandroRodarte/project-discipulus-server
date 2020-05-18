const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedClassNotes = persisted[db.names.classNote.modelName];

const classNotes = [

    // 0. unknown class with note
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. class[0] with note that has same title as classNote[0] associated to class[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedClassNotes[0].note.title
            }
        },

        // 2. class[0] with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.classNote.modelName]: classNotes
};
