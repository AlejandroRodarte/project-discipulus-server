const db = require('../');
const { studentFileSchema } = require('../schemas/student-file');

const { studentFile } = require('../names');

const StudentFile = db.getModel(studentFile.modelName, studentFileSchema);

module.exports = StudentFile;