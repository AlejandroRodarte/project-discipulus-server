const UserRole = require('../../../../../../../src/db/models/user-role');
const User = require('../../../../../../../src/db/models/user');
const Role = require('../../../../../../../src/db/models/role');

const { userRoles } = require('../../../../../models/user-role/persisted');
const { users } = require('../../../../../models/user/persisted');
const { roles } = require('../../../../../models/role/persisted');

const user = users[0];
const role = roles[0];
const userRole = userRoles[0];

const init = async () => {
    await new Role(role).save();
    await new User(user).save();
    await new UserRole(userRole).save();
};

module.exports = {
    fn: init,
    data: {
        user,
        role,
        userRole
    }
};