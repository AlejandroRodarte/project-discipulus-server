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
        }
    ]

};

module.exports = deletionUserRules;
