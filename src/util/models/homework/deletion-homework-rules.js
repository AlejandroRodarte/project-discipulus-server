const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionSessionRules = [
    {
        modelName: db.names.homeworkFile.modelName,
        fieldName: 'homework',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkNote.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkSection.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudent.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: deleteModes.REMOVE
    }
];

module.exports = deletionSessionRules;