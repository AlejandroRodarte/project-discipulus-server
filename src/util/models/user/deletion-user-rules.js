const { db } = require('../../../shared');

const deletionUserRules = [
    {
        modelName: db.names.userRole.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userFile.modelName,
        fieldName: 'user',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userEvent.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.userNote.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    }
];

module.exports = deletionUserRules;
