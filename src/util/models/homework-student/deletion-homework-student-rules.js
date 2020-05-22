const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionHomeworkStudentRules = [
    {
        modelName: db.names.homeworkStudentFile.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudentNote.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudentSection.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionHomeworkStudentRules;