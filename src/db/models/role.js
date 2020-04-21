const { model } = require('mongoose');

const { roleSchema } = require('../schemas/role');

const Role = model('Role', roleSchema)

module.exports = Role;
