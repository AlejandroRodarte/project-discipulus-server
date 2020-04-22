const Role = require('../../../../../src/db/models/role');

const sampleRole = require('../persisted/sample-role');

const nonUniqueRoles = {
    nonUniqueNameRole: new Role({
        name: sampleRole.name
    })
};

module.exports = nonUniqueRoles;
