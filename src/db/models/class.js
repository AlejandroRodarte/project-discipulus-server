const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { class: clazz } = require('../names');

const Class = getModel(clazz.modelName, schemas.classSchema);

module.exports = Class;
