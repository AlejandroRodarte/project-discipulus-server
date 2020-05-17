const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { role } = require('../names');

const Role = getModel(role.modelName, schemas.roleSchema);

module.exports = Role;
