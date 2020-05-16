const { Types } = require('mongoose');
const { class: clazz, classFile } = require('../../../../src/db/names');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const classes = [
    // 0: generate one sample class
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [ modelFunctions.generateFakeClass() ])
];

const classFiles = [
    // 0: generate one sample class file
    ...utilFunctions.generateOneToMany('class', classes[0]._id, [{ file: modelFunctions.generateFakeFile() }])
];

module.exports = {
    [clazz.modelName]: classes,
    [classFile.modelName]: classFiles
};
