const UserRole = require('../../../../../../../src/db/models/user-role');

const { sampleUserRole } = require('../../../../../models/user-role/persisted');

const init = async () => {
    await new UserRole(sampleUserRole).save();
};

module.exports = {
    fn: init,
    data: {
        sampleUserRole
    }
};
