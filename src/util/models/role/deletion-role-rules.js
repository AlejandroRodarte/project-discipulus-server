const { db } = require('../../../shared');

// needs improvement
const deletionRoleRules = [
    {
        modelName: db.names.userRole.modelName,
        fieldName: 'role',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    }
];

module.exports = deletionRoleRules;
