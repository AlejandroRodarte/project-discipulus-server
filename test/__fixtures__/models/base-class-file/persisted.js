const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const { class: clazz, classFile } = require('../../../../src/db/names');

const classes = [
    // 0: sample class
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [ modelFunctions.generateFakeClass() ])
];

const classFiles = [
    // 0-1: class[0] with two files
    ...utilFunctions.generateOneToMany('class', classes[0]._id, [{ file: modelFunctions.generateFakeFile() }, { file: modelFunctions.generateFakeFile() }])
];

module.exports = {
    [clazz.modelName]: classes,
    [classFile.modelName]: classFiles
};
