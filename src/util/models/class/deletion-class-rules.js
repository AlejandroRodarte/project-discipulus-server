const names = require('../../../db/names');

const deleteModes = require('../../delete-modes');

const deletionClassRules = [
    {
        modelName: names.classStudent.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.classStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.classUnknownStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionClassRules;
