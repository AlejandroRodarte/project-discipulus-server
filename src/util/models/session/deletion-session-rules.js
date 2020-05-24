const { db } = require('../../../shared');

const deletionSessionRules = [
    {
        modelName: db.names.sessionFile.modelName,
        fieldName: 'session',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.sessionNote.modelName,
        fieldName: 'session',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.sessionStudent.modelName,
        fieldName: 'session',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    }
];

module.exports = deletionSessionRules;