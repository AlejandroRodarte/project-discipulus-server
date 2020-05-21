const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkFile = getModel(db.names.homeworkFile.modelName, schemas.homeworkFileSchema);

module.exports = HomeworkFile;
