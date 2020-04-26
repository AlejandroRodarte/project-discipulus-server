const db = require('../');
const { userRoleSchema } = require('../schemas/user-role');

const { userRole } = require('../names');

const UserRole = db.getModel(userRole.modelName, userRoleSchema);

module.exports = UserRole;