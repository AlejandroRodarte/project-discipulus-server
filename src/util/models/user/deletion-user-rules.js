const names = require('../../../db/names');

const deletionUserRules = {

    ROLE_PARENT: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'parent'
        }
    ],

    ROLE_STUDENT: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'student'
        }
    ]

};

module.exports = deletionUserRules;
