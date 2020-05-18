const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const ClassStudentFile = getModel(db.names.classStudentFile.modelName, schemas.classStudentFileSchema);

module.exports = ClassStudentFile;
