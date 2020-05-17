const { Types } = require('mongoose');

const utilFunctions = require('../../functions/util');

const shared = require('../../shared');

const { classStudent, classStudentFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClassStudents = persisted.db[classStudent.modelName];

const classStudentFiles = [
    
    // 0. unknown class-student with pdf file
    ...utilFunctions.generateOneToMany('classStudent', new Types.ObjectId(), [{ file: shared.sampleFiles.textFile }]),

    ...utilFunctions.generateOneToMany('classStudent', persistedClassStudents[0]._id, [

        // 1. classStudent[0] with sheet file (already persisted, non-unique)
        { file: shared.sampleFiles.sheetFile },

        // 2. classStudent[0] with pptx file (unique)
        { file: shared.sampleFiles.presentationFile }

    ])

];

module.exports = {
    db: {
        [classStudentFile.modelName]: classStudentFiles
    }
};