const { Types } = require('mongoose');

const { userRole } = require('../../../../src/db/names');

const persisted = {

    [userRole.modelName]: [
        {
            user: new Types.ObjectId(),
            role: new Types.ObjectId()
        }
    ]

};

module.exports = persisted;