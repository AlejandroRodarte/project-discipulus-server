const db = require('../');
const { roleSchema } = require('../schemas/role');

const { role } = require('../names');

const Role = db.getModel(role.modelName, roleSchema);

module.exports = Role;
