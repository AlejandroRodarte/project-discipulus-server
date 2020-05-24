const { db, roles } = require('../../../../src/shared');

const persisted = require('./persisted');

const unpersisted = {

    [db.names.role.modelName]: [

        // 0. parent role (unique)
        {
            name: roles.ROLE_PARENT
        },

        // 1. teacher role (non-unique)
        {
            name: persisted[db.names.role.modelName][0].name
        }

    ]

};

module.exports = unpersisted;
