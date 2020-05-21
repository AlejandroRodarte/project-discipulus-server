const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const HomeworkSection = getModel(db.names.homeworkSection.modelName, schemas.homeworkSectionSchema);

module.exports = HomeworkSection;
