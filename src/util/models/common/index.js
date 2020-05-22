const generateFilePreRemove = require('./generate-file-pre-remove');
const generateSaveFileAndDoc = require('./generate-save-file-and-doc');
const generateUserAndRoleValidator = require('./generate-user-and-role-validator');
const generateParentDocExistsValidator = require('./generate-parent-doc-exists-validator');
const generateSimpleCheckAndSave = require('./generate-simple-check-and-save');
const generateSaveAndAddStudents = require('./generate-save-and-add-students');
const generateClassChildCheckAndSave = require('./generate-class-child-check-and-save');
const generateTaskValidator = require('./generate-task-validator');
const generateJointExistsValidator = require('./generate-joint-exists-validator');
const generateGetTaskValidationData = require('./generate-get-task-validation-data');
const userExistsValidator = require('./user-exists-validator');

module.exports = {
    generateFilePreRemove,
    generateSaveFileAndDoc,
    generateUserAndRoleValidator,
    generateParentDocExistsValidator,
    generateSimpleCheckAndSave,
    generateSaveAndAddStudents,
    generateClassChildCheckAndSave,
    generateTaskValidator,
    generateJointExistsValidator,
    generateGetTaskValidationData,
    userExistsValidator
};
