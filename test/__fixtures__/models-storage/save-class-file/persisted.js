const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const classes = [
    // 0. sample class
    ...util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ])
];

const classFiles = [
    // 0. class[0] has sample doc file
    ...util.generateOneToMany('class', classes[0]._id, [{ file: sampleFiles.documentFile }])
];

const storageClassFiles = util.attachKeynames([
    // 0. doc file associated to classFile[0]
    sampleFiles.documentFile
]);

module.exports = {

    db: {
        [db.names.class.modelName]: classes,
        [db.names.classFile.modelName]: classFiles
    },

    storage: {
        [db.names.classFile.modelName]: storageClassFiles
    }

};
