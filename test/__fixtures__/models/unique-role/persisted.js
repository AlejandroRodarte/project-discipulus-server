const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { roles } = require('../../../../src/util');

const persisted = {

    [db.names.role.modelName]: [

        // 0: teacher role
        {
            _id: new Types.ObjectId(),
            name: roles.ROLE_TEACHER
        }

    ]

};

module.exports = persisted;
