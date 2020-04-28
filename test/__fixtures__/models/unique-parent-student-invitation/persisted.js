const { Types } = require('mongoose');

const { parentStudentInvitation } = require('../../../../src/db/names');

const persisted = {

    [parentStudentInvitation.modelName]: [

        // 0. sample parent student invitation
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;