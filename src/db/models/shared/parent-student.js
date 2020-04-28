const db = require('../../../db');
const { sharedParentStudentSchema } = require('../../schemas/shared/parent-student');

const { sharedParentStudent } = require('../../names');

const SharedParentStudent = db.getModel(sharedParentStudent.modelName, sharedParentStudentSchema);

module.exports = SharedParentStudent;