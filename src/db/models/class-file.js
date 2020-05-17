const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classFile } = require('../names');

const ClassFile = getModel(classFile.modelName, schemas.classFileSchema);

module.exports = ClassFile;
