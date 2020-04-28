const { Types } = require('mongoose');

const { parentStudent } = require('../../../../src/db/names');

const persisted = {

    [parentStudent.modelName]: [

        // 0. sample parent student
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;