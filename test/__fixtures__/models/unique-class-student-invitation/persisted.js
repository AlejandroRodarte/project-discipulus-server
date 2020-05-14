const { Types } = require('mongoose');

const { classStudentInvitation } = require('../../../../src/db/names');

const classStudentInvitations = [
    // 0. sample class student
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
];

module.exports = {
    [classStudentInvitation.modelName]: classStudentInvitations
};
