const db = require('..');
const { classStudentFileSchema } = require('../schemas/class-student-file');

const { classStudentFile } = require('../names');

const ClassStudentFile = db.getModel(classStudentFile.modelName, classStudentFileSchema);

module.exports = ClassStudentFile;