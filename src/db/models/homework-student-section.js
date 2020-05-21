const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkStudentSection = getModel(db.names.homeworkStudentSection.modelName, schemas.homeworkStudentSectionSchema);

module.exports = HomeworkStudentSection;
