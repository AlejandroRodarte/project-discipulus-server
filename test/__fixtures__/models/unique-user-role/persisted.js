const { Types } = require('mongoose');

const { userRole } = require('../../../../src/db/names');

const persisted = {

    [userRole.modelName]: [

        // 0. sample user role
        {
            user: new Types.ObjectId(),
            role: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;