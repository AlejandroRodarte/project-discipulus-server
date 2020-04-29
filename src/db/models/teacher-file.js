const db = require('..');
const { teacherFileSchema } = require('../schemas/teacher-file');

const { teacherfile } = require('../names');

const TeacherFile = db.getModel(teacherfile.modelName, teacherFileSchema);

module.exports = TeacherFile;