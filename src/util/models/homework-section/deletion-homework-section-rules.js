const { db } = require('../../../shared');

const deletionHomeworkSectionRules = [
    {
        modelName: db.names.homeworkStudentSection.modelName,
        fieldName: 'homeworkSection',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    }
];

module.exports = deletionHomeworkSectionRules;