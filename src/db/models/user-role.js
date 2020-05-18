const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const UserRole = getModel(db.names.userRole.modelName, schemas.userRoleSchema);

module.exports = UserRole;
