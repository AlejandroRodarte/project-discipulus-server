const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { userRoleDefinition, userRoleSchema } = require('./user-role');
const { parentStudentDefinition, parentStudentSchema } = require('./parent-student');
const { userFileDefinition, userFileSchema } = require('./user-file');
const { parentFileDefinition, parentFileSchema } = require('./parent-file');
const { studentFileDefinition, studentFileSchema } = require('./student-file');
const { teacherFileDefinition, teacherFileSchema } = require('./teacher-file');
const { userEventDefinition, userEventSchema } = require('./user-event');
const { classDefinition, classSchema } = require('./class');
const { classStudentDefinition, classStudentSchema } = require('./class-student');
const { classStudentInvitationDefinition, classStudentInvitationSchema } = require('./class-student-invitation');
const { classUnknownStudentInvitationDefinition, classUnknownStudentInvitationSchema } = require('./class-unknown-student-invitation');
const { classFileDefinition, classFileSchema } = require('./class-file');
const { classStudentFileDefinition, classStudentFileSchema } = require('./class-student-file');
const shared = require('./shared');

module.exports = {

    definitions: {
        roleDefinition,
        userDefinition,
        fileDefinition,
        userRoleDefinition,
        parentStudentDefinition,
        userFileDefinition,
        parentFileDefinition,
        studentFileDefinition,
        teacherFileDefinition,
        userEventDefinition,
        classDefinition,
        classStudentDefinition,
        classStudentInvitationDefinition,
        classUnknownStudentInvitationDefinition,
        classFileDefinition,
        classStudentFileDefinition
    },

    schemas: {
        roleSchema,
        userSchema,
        fileSchema,
        userRoleSchema,
        parentStudentSchema,
        userFileSchema,
        parentFileSchema,
        studentFileSchema,
        teacherFileSchema,
        userEventSchema,
        classSchema,
        classStudentSchema,
        classStudentInvitationSchema,
        classUnknownStudentInvitationSchema,
        classFileSchema,
        classStudentFileSchema
    },

    shared

};
