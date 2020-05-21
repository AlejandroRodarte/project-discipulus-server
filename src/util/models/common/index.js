const generateFilePreRemove = require('./generate-file-pre-remove');
const generateSaveFileAndDoc = require('./generate-save-file-and-doc');
const generateUserAndRoleValidator = require('./generate-user-and-role-validator');
const generateParentDocExistsValidator = require('./generate-parent-doc-exists-validator');
const generateNoteCheckAndSave = require('./generate-note-check-and-save');
const generateSaveAndAddStudents = require('./generate-save-and-add-students');
const generateClassStudentChildCheckAndSave = require('./generate-class-student-child-check-and-save');
const generateDueDateUploadValidator = require('./generate-due-date-upload-validator');
const generateTaskValidator = require('./generate-task-validator');
const userExistsValidator = require('./user-exists-validator');

module.exports = {
    generateFilePreRemove,
    generateSaveFileAndDoc,
    generateUserAndRoleValidator,
    generateParentDocExistsValidator,
    generateNoteCheckAndSave,
    generateSaveAndAddStudents,
    generateClassStudentChildCheckAndSave,
    generateDueDateUploadValidator,
    generateTaskValidator,
    userExistsValidator
};
