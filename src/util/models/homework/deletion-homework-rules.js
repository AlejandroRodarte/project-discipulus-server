const { db } = require('../../../shared');

const deletionSessionRules = [
    {
        modelName: db.names.homeworkFile.modelName,
        fieldName: 'homework',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkNote.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkSection.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.homeworkStudent.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    }
];

module.exports = deletionSessionRules;