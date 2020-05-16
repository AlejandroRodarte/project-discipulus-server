const roles = require('../../roles');

const names = require('../../../db/names');

const deleteModes = require('../../delete-modes');

const deletionUserRulesByRole = {

    [roles.ROLE_PARENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'parent',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'parent',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.parentFile.modelName,
            fieldName: 'user',
            deleteFiles: true,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.parentNote.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        }
    ],

    [roles.ROLE_STUDENT]: [
        {
            modelName: names.parentStudent.modelName,
            fieldName: 'student',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.parentStudentInvitation.modelName,
            fieldName: 'student',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.studentFile.modelName,
            fieldName: 'user',
            deleteFiles: true,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.classStudent.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.REMOVE
        },
        {
            modelName: names.classStudentInvitation.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.studentNote.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        }
    ],

    [roles.ROLE_TEACHER]: [
        {
            modelName: names.teacherFile.modelName,
            fieldName: 'user',
            deleteFiles: true,
            deleteMode: deleteModes.DELETE_MANY
        },
        {
            modelName: names.class.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.REMOVE
        },
        {
            modelName: names.teacherNote.modelName,
            fieldName: 'user',
            deleteFiles: false,
            deleteMode: deleteModes.DELETE_MANY
        }
    ]

};

module.exports = deletionUserRulesByRole;
