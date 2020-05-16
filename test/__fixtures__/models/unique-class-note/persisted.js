const { Types } = require('mongoose');
const { class: clazz, classNote } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const classes = [
    // 0: generate one sample class
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [ modelFunctions.generateFakeClass() ])
];

const classNotes = [
    // 0: class[0] with sample note
    ...utilFunctions.generateOneToMany('class', classes[0]._id, [{ note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [clazz.modelName]: classes,
    [classNote.modelName]: classNotes
};
