const { db } = require('../../../shared');

const deletionClassRules = [
    {
        modelName: db.names.classStudent.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    },
    {
        modelName: db.names.classStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classUnknownStudentInvitation.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classFile.modelName,
        fieldName: 'class',
        deleteFiles: true,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.classNote.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.DELETE_MANY
    },
    {
        modelName: db.names.session.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    },
    {
        modelName: db.names.homework.modelName,
        fieldName: 'class',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    }
];

module.exports = deletionClassRules;
