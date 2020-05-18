const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const User = getModel(db.names.user.modelName, schemas.userSchema);

module.exports = User;

