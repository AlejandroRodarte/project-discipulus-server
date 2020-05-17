const { Types } = require('mongoose');

const modelFunctions = require('../../functions/models');
const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { class: clazz, classFile } = require('../../../../src/db/names');

const classes = [
    // 0. sample class
    ...utilFunctions.generateOneToMany('user', new Types.ObjectId(), [ modelFunctions.generateFakeClass() ])
];

const classFiles = [
    // 0. class[0] has sample doc file
    ...utilFunctions.generateOneToMany('class', classes[0]._id, [{ file: shared.sampleFiles.documentFile }])
];

const storageClassFiles = utilFunctions.attachKeynames([
    // 0. doc file associated to classFile[0]
    shared.sampleFiles.documentFile
]);

module.exports = {

    db: {
        [clazz.modelName]: classes,
        [classFile.modelName]: classFiles
    },

    storage: {
        [classFile.modelName]: storageClassFiles
    }

};
