const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionUserRules = [
    {
        modelName: db.names.userRole.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userFile.modelName,
        fieldName: 'user',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userEvent.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userNote.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionUserRules;
