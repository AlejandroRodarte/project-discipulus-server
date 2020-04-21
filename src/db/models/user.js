const { model } = require('mongoose');

const { userSchema } = require('../schemas/user');

const User = model('User', userSchema)

module.exports = User;
