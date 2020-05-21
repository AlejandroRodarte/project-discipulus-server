const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const Homework = getModel(db.names.homework.modelName, schemas.homeworkSchema);

module.exports = Homework;
