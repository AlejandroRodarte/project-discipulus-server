const db = require('../');
const { userRoleSchema } = require('../schemas/user-role');

const UserRole = db.getModel('UserRole', userRoleSchema);

module.exports = UserRole;