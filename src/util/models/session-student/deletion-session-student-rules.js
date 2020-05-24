const { db } = require('../../../shared');

const deletionSessionRules = [
    {
        modelName: db.names.sessionStudentFile.modelName,
        fieldName: 'sessionStudent',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.sessionStudentNote.modelName,
        fieldName: 'sessionStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    }
];

module.exports = deletionSessionRules;