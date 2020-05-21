const { db } = require('../../../shared');

const { shared } = require('../../schemas');
const getModel = require('../../get-model');

const SharedClassGrade = getModel(db.names.sharedClassGrade.modelName, shared.schemas.sharedClassGradeSchema);

module.exports = SharedClassGrade;
