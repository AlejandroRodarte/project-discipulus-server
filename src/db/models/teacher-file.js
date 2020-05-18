const { db } = require('../../shared');

const { schemas } = require('../schemas');
const getModel = require('../get-model');

const TeacherFile = getModel(db.names.teacherFile.modelName, schemas.teacherFileSchema);

module.exports = TeacherFile;
