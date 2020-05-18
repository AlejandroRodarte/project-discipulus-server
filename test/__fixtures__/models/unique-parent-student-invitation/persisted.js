const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const persisted = {

    [db.names.parentStudentInvitation.modelName]: [

        // 0. sample parent student invitation
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;