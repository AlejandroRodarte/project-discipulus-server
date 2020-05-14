const { Types } = require('mongoose');
const faker = require('faker');

const { classUnknownStudentInvitation } = require('../../../../src/db/names');

const classUnknownStudentInvitations = [
    // 0. sample class unknown student invitation
    {
        class: new Types.ObjectId(),
        email: faker.internet.email()
    }
];

module.exports = {
    [classUnknownStudentInvitation.modelName]: classUnknownStudentInvitations
};
