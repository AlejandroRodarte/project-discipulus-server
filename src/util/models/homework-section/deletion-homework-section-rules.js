const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionHomeworkSectionRules = [
    {
        modelName: db.names.homeworkStudentSection.modelName,
        fieldName: 'homeworkSection',
        deleteFiles: false,
        deleteMode: deleteModes.DELETE_MANY
    }
];

module.exports = deletionHomeworkSectionRules;