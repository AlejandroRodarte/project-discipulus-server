const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const persisted = {

    [db.names.userRole.modelName]: [

        // 0. sample user role
        {
            user: new Types.ObjectId(),
            role: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;