const { db } = require('../../../shared');

const deletionClassStudentRules = [
    {
        modelName: db.names.classStudentFile.modelName,
        fieldName: 'classStudent',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classStudentNote.modelName,
        fieldName: 'classStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.sessionStudent.modelName,
        fieldName: 'classStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    },
    {
        modelName: db.names.homeworkStudent.modelName,
        fieldName: 'classStudent',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    }
];

module.exports = deletionClassStudentRules;
