const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { class: clazz, classNote } = require('../../../../src/db/names');

const classes = [
    // 0: sample class
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [ modelFunctions.generateFakeClass() ])
];

const classNotes = [
    // 0-1: class[0] with two notes
    ...utilFunctions.generateOneToMany('class', classes[0]._id, [{ note: modelFunctions.generateFakeNote() }, { note: modelFunctions.generateFakeNote() }])
];

module.exports = {
    [clazz.modelName]: classes,
    [classNote.modelName]: classNotes
};
