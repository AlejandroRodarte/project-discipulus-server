const { Types } = require('mongoose');

const { util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedSessionStudents = persisted.db[db.names.sessionStudent.modelName];

const sessionStudentFiles = [
    
    // 0. unknown session-student with text file
    ...util.generateOneToMany('sessionStudent', new Types.ObjectId(), [{ file: sampleFiles.textFile }]),

    ...util.generateOneToMany('sessionStudent', persistedSessionStudents[0]._id, [

        // 1. sessionStudent[0] with sheet file (already persisted, non-unique)
        { file: sampleFiles.sheetFile },

        // 2. sessionStudent[0] with pptx file (unique)
        { file: sampleFiles.presentationFile }

    ])

];

module.exports = {
    db: {
        [db.names.sessionStudentFile.modelName]: sessionStudentFiles
    }
};