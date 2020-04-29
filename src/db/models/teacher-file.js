const db = require('..');
const { teacherFileSchema } = require('../schemas/teacher-file');

const { teacherFile } = require('../names');

const TeacherFile = db.getModel(teacherFile.modelName, teacherFileSchema);

module.exports = TeacherFile;