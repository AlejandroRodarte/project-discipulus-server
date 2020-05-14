const { Types } = require('mongoose');

const { classStudentInvitation } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedClassStudentInvitations = persisted[classStudentInvitation.modelName];

const classStudentInvitations = [

    // 0. same class/user combo as classStudentInvitation[0]
    {
        class: persistedClassStudentInvitations[0].class,
        user: persistedClassStudentInvitations[0].user
    },

    // 1. same class, different user
    {
        class: persistedClassStudentInvitations[0].class,
        user: new Types.ObjectId()
    },

    // 2. same user, different class
    {
        class: new Types.ObjectId(),
        user: persistedClassStudentInvitations[0].user
    },

    // 3. different class/user
    {
        class: new Types.ObjectId(),
        user: new Types.ObjectId()
    }
    
];

module.exports = {
    [classStudentInvitation.modelName]: classStudentInvitations
};
