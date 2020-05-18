const { db } = require('../../../shared');
const deleteModes = require('../../delete-modes');

// needs improvement
const deletionRoleRules = [
    {
        modelName: db.names.userRole.modelName,
        fieldName: 'role',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionRoleRules;
