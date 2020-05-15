const names = require('../../../db/names');
const deleteModes = require('../../delete-modes');

// needs improvement
const deletionRoleRules = [
    {
        modelName: names.userRole.modelName,
        fieldName: 'role',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionRoleRules;