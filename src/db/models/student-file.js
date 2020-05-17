const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { studentFile } = require('../names');

const StudentFile = getModel(studentFile.modelName, schemas.studentFileSchema);

module.exports = StudentFile;
