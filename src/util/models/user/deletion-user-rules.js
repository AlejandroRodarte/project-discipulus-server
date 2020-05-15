const names = require('../../../db/names');
const deleteModes = require('../../delete-modes');

const deletionUserRules = [
    {
        modelName: names.userRole.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.userFile.modelName,
        fieldName: 'user',
        deleteFiles: true,
        deleteMode: deleteModes.DELETE_MANY
    },
    {
        modelName: names.userEvent.modelName,
        fieldName: 'user',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionUserRules;
