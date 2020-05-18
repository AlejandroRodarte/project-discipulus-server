const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedParentStudent = getModel(db.names.sharedParentStudent.modelName, shared.schemas.sharedParentStudentSchema);

module.exports = SharedParentStudent;