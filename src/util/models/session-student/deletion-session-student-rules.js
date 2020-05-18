const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionSessionRules = [
    {
        modelName: db.names.sessionStudentFile.modelName,
        fieldName: 'sessionStudent',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.sessionStudentNote.modelName,
        fieldName: 'session',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionSessionRules;