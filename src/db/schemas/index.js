const { roleDefinition, roleSchema } = require('./role');
const { userDefinition, userSchema } = require('./user');
const { userRoleDefinition, userRoleSchema } = require('./user-role');
const { parentStudentDefinition, parentStudentSchema } = require('./parent-student');
const { parentStudentInvitationDefinition, parentStudentInvitationSchema } = require('./parent-student-invitation');
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
const { userNoteDefinition, userNoteSchema } = require('./user-note');
const { parentNoteDefinition, parentNoteSchema } = require('./parent-note');
const { studentNoteDefinition, studentNoteSchema } = require('./student-note');
const { teacherNoteDefinition, teacherNoteSchema } = require('./teacher-note');
const { classNoteDefinition, classNoteSchema } = require('./class-note');
const { classStudentNoteDefinition, classStudentNoteSchema } = require('./class-student-note');
const { sessionDefinition, sessionSchema } = require('./session');
const { sessionFileDefinition, sessionFileSchema } = require('./session-file');
const { sessionNoteDefinition, sessionNoteSchema } = require('./session-note');
const { sessionStudentDefinition, sessionStudentSchema } = require('./session-student');
const { sessionStudentFileDefinition, sessionStudentFileSchema } = require('./session-student-file');
const { sessionStudentNoteDefinition, sessionStudentNoteSchema } = require('./session-student-note');
const { homeworkDefinition, homeworkSchema } = require('./homework');
const { homeworkFileDefinition, homeworkFileSchema } = require('./homework-file');
const { homeworkNoteDefinition, homeworkNoteSchema } = require('./homework-note');
const { homeworkSectionDefinition, homeworkSectionSchema } = require('./homework-section');
const shared = require('./shared');

module.exports = {

    definitions: {
        roleDefinition,
        userDefinition,
        userRoleDefinition,
        parentStudentDefinition,
        parentStudentInvitationDefinition,
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
        classStudentFileDefinition,
        userNoteDefinition,
        parentNoteDefinition,
        studentNoteDefinition,
        teacherNoteDefinition,
        classNoteDefinition,
        classStudentNoteDefinition,
        sessionDefinition,
        sessionFileDefinition,
        sessionNoteDefinition,
        sessionStudentDefinition,
        sessionStudentFileDefinition,
        sessionStudentNoteDefinition,
        homeworkDefinition,
        homeworkFileDefinition,
        homeworkNoteDefinition,
        homeworkSectionDefinition
    },

    schemas: {
        roleSchema,
        userSchema,
        userRoleSchema,
        parentStudentSchema,
        parentStudentInvitationSchema,
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
        classStudentFileSchema,
        userNoteSchema,
        parentNoteSchema,
        studentNoteSchema,
        teacherNoteSchema,
        classNoteSchema,
        classStudentNoteSchema,
        sessionSchema,
        sessionFileSchema,
        sessionNoteSchema,
        sessionStudentSchema,
        sessionStudentFileSchema,
        sessionStudentNoteSchema,
        homeworkSchema,
        homeworkFileSchema,
        homeworkNoteSchema,
        homeworkSectionSchema
    },

    shared

};
