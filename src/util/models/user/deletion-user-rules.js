const roles = require('../../roles');

const names = require('../../../db/names');

const deletionUserRules = {

    [roles.ROLE_PARENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'parent',
            deleteFiles: false
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'parent',
            deleteFiles: false
        },
        {
            modelName: names.parentFile.modelName,
            fieldName: 'user',
            deleteFiles: true
        }
    ],

    [roles.ROLE_STUDENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'student',
            deleteFiles: false
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'student',
            deleteFiles: false
        },
        {
            modelName: names.studentFile.modelName,
            fieldName: 'user',
            deleteFiles: true
        }
    ],

    [roles.ROLE_TEACHER]: [
        {
            modelName: names.teacherFile.modelName,
            fieldName: 'user',
            deleteFiles: true
        }
    ]

};

module.exports = deletionUserRules;
