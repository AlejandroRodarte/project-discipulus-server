const { class: clazz, classNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const persisted = require('./persisted');

const persistedClasses = persisted[clazz.modelName];
const persistedClassNotes = persisted[classNote.modelName];

const classNotes = [
    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 0: class[0] with note that has same tutle as classNote[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedClassNotes[0].note.title
            }
        },

        // 1: class[0] with unique note
        { note: modelFunctions.generateFakeNote() }

    ])
];

module.exports = {
    [classNote.modelName]: classNotes
};
