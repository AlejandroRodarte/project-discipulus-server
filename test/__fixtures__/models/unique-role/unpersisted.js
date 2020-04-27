const roleTypes = require('../../../../src/util/roles');

const { role } = require('../../../../src/db/names');

const persisted = require('./persisted');

const unpersisted = {

    [role.modelName]: [

        // 0. parent role (unique)
        {
            name: roleTypes.ROLE_PARENT
        },

        // 1. teacher role (non-unique)
        {
            name: persisted[role.modelName][0].name
        }

    ]

};

module.exports = unpersisted;
