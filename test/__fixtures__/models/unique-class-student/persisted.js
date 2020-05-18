const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const classStudents = [
    // 0. sample class student
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
];

module.exports = {
    [db.names.classStudent.modelName]: classStudents
};
