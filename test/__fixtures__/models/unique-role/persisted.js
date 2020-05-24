const { Types } = require('mongoose');

const { db, roles } = require('../../../../src/shared');

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
