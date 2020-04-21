const { Schema } = require('mongoose');

const roleDefinition = require('./definition');

const roleSchema = new Schema(roleDefinition);

module.exports = roleSchema;
