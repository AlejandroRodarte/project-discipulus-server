const roleTypes = require('../../../../src/util/roles');

const { role } = require('../../../../src/db/names');

const persisted = require('./persisted');

const unpersisted = {

    [role.modelName]: [
        {
            name: roleTypes.ROLE_PARENT
        },
        {
            name: persisted[role.modelName][0].name
        }
    ]

};

module.exports = unpersisted;
