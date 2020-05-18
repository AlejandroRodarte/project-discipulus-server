const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassFile = getModel(db.names.classFile.modelName, schemas.classFileSchema);

module.exports = ClassFile;
