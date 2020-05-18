const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionSessionRules = [
    {
        modelName: db.names.sessionFile.modelName,
        fieldName: 'session',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionSessionRules;