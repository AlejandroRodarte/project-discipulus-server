const db = require('../');

const { userSchema } = require('../schemas/user');

const User = db.getModel('User', userSchema);

module.exports = User;
