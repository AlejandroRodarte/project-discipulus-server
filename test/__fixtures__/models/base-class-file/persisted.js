const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const classes = [
    // 0: sample class
    ...util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ])
];

const classFiles = [
    // 0-1: class[0] with two files
    ...util.generateOneToMany('class', classes[0]._id, [{ file: models.generateFakeFile() }, { file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.class.modelName]: classes,
    [db.names.classFile.modelName]: classFiles
};
