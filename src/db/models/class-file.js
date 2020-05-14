const db = require('..');
const { classFileSchema } = require('../schemas/class-file');

const { classFile } = require('../names');

const ClassFile = db.getModel(classFile.modelName, classFileSchema);

module.exports = ClassFile;