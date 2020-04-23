const db = require('../');

const { roleSchema } = require('../schemas/role');

const Role = db.getModel('Role', roleSchema);

module.exports = Role;
