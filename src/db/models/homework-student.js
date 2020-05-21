const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkStudent = getModel(db.names.homeworkStudent.modelName, schemas.homeworkStudentSchema);

module.exports = HomeworkStudent;
