const Role = require('./role');
const User = require('./user');
const UserRole = require('./user-role');
const ParentStudent = require('./parent-student');
const ParentStudentInvitation = require('./parent-student-invitation');
const ParentFile = require('./parent-file');
const TeacherFile = require('./teacher-file');
const StudentFile = require('./student-file');
const UserFile = require('./user-file');
const UserEvent = require('./user-event');
const Class = require('./class');
const ClassStudent = require('./class-student');
const ClassStudentInvitation = require('./class-student-invitation');
const ClassUnknownStudentInvitation = require('./class-unknown-student-invitation');
const ClassFile = require('./class-file');
const ClassStudentFile = require('./class-student-file');
const UserNote = require('./user-note');
const Shared = require('./shared');

module.exports = {
    Role,
    User,
    UserRole,
    ParentStudent,
    ParentStudentInvitation,
    ParentFile,
    TeacherFile,
    StudentFile,
    UserFile,
    UserEvent,
    Class,
    ClassStudent,
    ClassStudentInvitation,
    ClassUnknownStudentInvitation,
    ClassFile,
    ClassStudentFile,
    UserNote,
    Shared
};
