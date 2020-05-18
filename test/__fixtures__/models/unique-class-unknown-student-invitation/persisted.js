const { Types } = require('mongoose');
const faker = require('faker');

const { db } = require('../../../../src/shared');

const classUnknownStudentInvitations = [
    // 0. sample class unknown student invitation
    {
        class: new Types.ObjectId(),
        email: faker.internet.email()
    }
];

module.exports = {
    [db.names.classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
