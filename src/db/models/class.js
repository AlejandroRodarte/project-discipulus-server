const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const Class = getModel(db.names.class.modelName, schemas.classSchema);

module.exports = Class;
