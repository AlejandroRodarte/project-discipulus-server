const roles = require('../../roles');

const names = require('../../../db/names');

const deletionUserRules = {

    [roles.ROLE_PARENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'parent'
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'parent'
        },
        {
            modelName: names.parentFile.modelName,
            fieldName: 'user'
        }
    ],

    [roles.ROLE_STUDENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'student'
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'student'
        },
        {
            modelName: names.studentFile.modelName,
            fieldName: 'user'
        }
    ],

    [roles.ROLE_TEACHER]: [
        {
            modelName: names.teacherFile.modelName,
            fieldName: 'user'
        }
    ]

};

module.exports = deletionUserRules;
