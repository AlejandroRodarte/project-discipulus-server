const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionClassRules = [
    {
        modelName: db.names.classStudent.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.REMOVE
    },
    {
        modelName: db.names.classStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classUnknownStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classFile.modelName,
        fieldName: 'class',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classNote.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionClassRules;
