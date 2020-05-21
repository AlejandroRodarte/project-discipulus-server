const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkStudentFile = getModel(db.names.homeworkStudentFile.modelName, schemas.homeworkStudentFileSchema);

module.exports = HomeworkStudentFile;
