const userRolePipelines = require('./user-role');
const classStudentPipelines = require('./class-student');
const sharedPipelines = require('./shared');
const homeworkStudentSectionPipelines = require('./homework-student-section');
const homeworkStudentPipelines = require('./homework-student');
const homeworkPipelines = require('./homework');

module.exports = {
    userRolePipelines,
    classStudentPipelines,
    sharedPipelines,
    homeworkStudentSectionPipelines,
    homeworkStudentPipelines,
    homeworkPipelines
};
