const clazz = require('./class');
const classStudent = require('./class-student');
const common = require('./common');
const role = require('./role');
const user = require('./user');
const session = require('./session');
const sessionStudent = require('./session-student');
const homework = require('./homework');
const homeworkStudent = require('./homework-student');
const homeworkSection = require('./homework-section');

module.exports = {
    class: clazz,
    classStudent,
    common,
    role,
    user,
    session,
    sessionStudent,
    homework,
    homeworkStudent,
    homeworkSection
};
