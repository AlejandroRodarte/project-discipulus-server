const db = require('..');
const { classSchema } = require('../schemas/class');

const { class: clazz } = require('../names');

const Class = db.getModel(clazz.modelName, classSchema);

module.exports = Class;