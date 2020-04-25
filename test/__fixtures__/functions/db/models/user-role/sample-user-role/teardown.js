const UserRole = require('../../../../../../../src/db/models/user-role');

const teardown = async () => {
    await UserRole.deleteMany({});
};

module.exports = teardown;
