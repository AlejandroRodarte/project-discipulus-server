const { Schema } = require('mongoose');

const userDefinition = require('./definition');

const userSchema = new Schema(userDefinition);

module.exports = userSchema;
