const UserRole = require('../../../../../../../src/db/models/user-role');
const User = require('../../../../../../../src/db/models/user');
const Role = require('../../../../../../../src/db/models/role');

const teardown = async () => {
    await UserRole.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});
};

module.exports = teardown;
