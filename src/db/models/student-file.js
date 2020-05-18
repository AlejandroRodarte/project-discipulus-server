const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const StudentFile = getModel(db.names.studentFile.modelName, schemas.studentFileSchema);

module.exports = StudentFile;
