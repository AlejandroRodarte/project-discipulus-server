const { shared } = require('../../schemas');
const { sharedParentStudent } = require('../../names');
const getModel = require('../../get-model');

const SharedParentStudent = getModel(sharedParentStudent.modelName, shared.schemas.sharedParentStudentSchema);

module.exports = SharedParentStudent;