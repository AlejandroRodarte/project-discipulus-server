const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const Role = getModel(db.names.role.modelName, schemas.roleSchema);

module.exports = Role;
