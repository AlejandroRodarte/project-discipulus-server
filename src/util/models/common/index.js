const generateFilePreRemove = require('./generate-file-pre-remove');
const generateSaveFileAndDoc = require('./generate-save-file-and-doc');
const generateUserAndRoleValidator = require('./generate-user-and-role-validator');
const generateParentDocExistsValidator = require('./generate-parent-doc-exists-validator');
const generateNoteCheckAndSave = require('./generate-note-check-and-save');
const userExistsValidator = require('./user-exists-validator');

module.exports = {
    generateFilePreRemove,
    generateSaveFileAndDoc,
    generateUserAndRoleValidator,
    generateParentDocExistsValidator,
    generateNoteCheckAndSave,
    userExistsValidator
};
