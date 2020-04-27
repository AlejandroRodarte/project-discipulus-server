const { Types } = require('mongoose');

const { role } = require('../../../../src/db/names');

const roleTypes = require('../../../../src/util/roles');

const persisted = {

    [role.modelName]: [
        {
            _id: new Types.ObjectId(),
            name: roleTypes.ROLE_TEACHER
        }
    ]

};

module.exports = persisted;
