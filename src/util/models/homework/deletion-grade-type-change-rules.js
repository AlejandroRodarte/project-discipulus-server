const { db } = require('../../../shared');

const deletionGradeTypeChangeRules = [
    {
        modelName: db.names.homeworkStudent.modelName,
        fieldName: 'homework',
        deleteFiles: false,
        deleteMode: db.deleteModes.REMOVE
    }
];

module.exports = deletionGradeTypeChangeRules;