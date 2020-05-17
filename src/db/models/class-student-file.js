const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { classStudentFile } = require('../names');

const ClassStudentFile = getModel(classStudentFile.modelName, schemas.classStudentFileSchema);

module.exports = ClassStudentFile;
