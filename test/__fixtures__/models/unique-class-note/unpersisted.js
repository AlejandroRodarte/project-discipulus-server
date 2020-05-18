const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedClassNotes = persisted[db.names.classNote.modelName];

const classNotes = [
    ...util.generateOneToMany('class', persistedClasses[0]._id, [

        // 0: class[0] with note that has same tutle as classNote[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedClassNotes[0].note.title
            }
        },

        // 1: class[0] with unique note
        { note: models.generateFakeNote() }

    ])
];

module.exports = {
    [db.names.classNote.modelName]: classNotes
};
