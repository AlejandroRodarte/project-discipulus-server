const { sampleUserRole } = require('../../user-role/persisted');

const nonUniqueUserRole = {
    user: sampleUserRole.user,
    role: sampleUserRole.role
};

module.exports = nonUniqueUserRole;
