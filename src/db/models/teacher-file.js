const { schemas } = require('../schemas');

const getModel = require('../get-model');
const { teacherFile } = require('../names');

const TeacherFile = getModel(teacherFile.modelName, schemas.teacherFileSchema);

module.exports = TeacherFile;
