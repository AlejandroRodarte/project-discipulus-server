const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { userRole } = require('../names');

const UserRole = getModel(userRole.modelName, schemas.userRoleSchema);

module.exports = UserRole;
