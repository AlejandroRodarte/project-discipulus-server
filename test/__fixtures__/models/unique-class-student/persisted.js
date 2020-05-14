const { Types } = require('mongoose');

const { classStudent } = require('../../../../src/db/names');

const classStudents = [
    // 0. sample class student
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
];

module.exports = {
    [classStudent.modelName]: classStudents
};
