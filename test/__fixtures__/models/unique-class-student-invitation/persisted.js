const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const classStudentInvitations = [
    // 0. sample class student invitation
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
];

module.exports = {
    [db.names.classStudentInvitation.modelName]: classStudentInvitations
};
