const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClassStudents = persisted.db[db.names.classStudent.modelName];

const classStudentFiles = [
    
    // 0. unknown class-student with pdf file
    ...util.generateOneToMany('classStudent', new Types.ObjectId(), [{ file: sampleFiles.textFile }]),

    ...util.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 1. classStudent[0] with sheet file (already persisted, non-unique)
        { file: sampleFiles.sheetFile },

        // 2. classStudent[0] with pptx file (unique)
        { file: sampleFiles.presentationFile }

    ])

];

module.exports = {
    db: {
        [db.names.classStudentFile.modelName]: classStudentFiles
    }
};