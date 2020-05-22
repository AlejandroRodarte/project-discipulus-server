const { db } = require('../../../shared');

const deleteModes = require('../../delete-modes');

const deletionGradeTypeChangeRules = [
    {
        modelName: db.names.homeworkStudent.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: deleteModes.REMOVE
    }
];

module.exports = deletionGradeTypeChangeRules;