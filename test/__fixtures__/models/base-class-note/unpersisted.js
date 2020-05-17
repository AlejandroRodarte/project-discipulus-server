const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { class: clazz, classNote } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClasses = persisted[clazz.modelName];
const persistedClassNotes = persisted[classNote.modelName];

const classNotes = [

    // 0. unknown class with note
    ...utilFunctions.generateOneToMany('class', new Types.ObjectId(), [{ note: modelFunctions.generateFakeNote() }]),

    ...utilFunctions.generateOneToMany('class', persistedClasses[0]._id, [

        // 1. class[0] with note that has same title as classNote[0] associated to class[0]
        {
            note: {
                ...modelFunctions.generateFakeNote(),
                title: persistedClassNotes[0].note.title
            }
        },

        // 2. class[0] with unique note
        { note: modelFunctions.generateFakeNote() }

    ])

];

module.exports = {
    [classNote.modelName]: classNotes
};
