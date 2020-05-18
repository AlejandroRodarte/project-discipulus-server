const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const classes = [
    // 0: generate one sample class
    ...util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ])
];

const classFiles = [
    // 0: generate one sample class file
    ...util.generateOneToMany('class', classes[0]._id, [{ file: models.generateFakeFile() }])
];

module.exports = {
    [db.names.class.modelName]: classes,
    [db.names.classFile.modelName]: classFiles
};
