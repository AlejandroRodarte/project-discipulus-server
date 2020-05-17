const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { user } = require('../names');

const User = getModel(user.modelName, schemas.userSchema);

module.exports = User;

