const { names } = require('../../../db');

const deleteModes = require('../../delete-modes');

const deletionClassStudentRules = [
    {
        modelName: names.classStudentFile.modelName,
        fieldName: 'classStudent',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.classStudentNote.modelName,
        fieldName: 'classStudent',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionClassStudentRules;
