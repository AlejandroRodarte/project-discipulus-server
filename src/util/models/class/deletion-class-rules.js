const { names } = require('../../../db');

const deleteModes = require('../../delete-modes');

const deletionClassRules = [
    {
        modelName: names.classStudent.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.REMOVE
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
    },
    {
        modelName: names.classFile.modelName,
        fieldName: 'class',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.classNote.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionClassRules;
