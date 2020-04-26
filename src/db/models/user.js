const db = require('../');
const { userSchema } = require('../schemas/user');

const { user } = require('../names');

const User = db.getModel(user.modelName, userSchema);

module.exports = User;
