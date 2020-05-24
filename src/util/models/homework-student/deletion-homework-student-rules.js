const { db } = require('../../../shared');

const deletionHomeworkStudentRules = [
    {
        modelName: db.names.homeworkStudentFile.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudentNote.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudentSection.modelName,
        fieldName: 'homeworkStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    }
];

module.exports = deletionHomeworkStudentRules;