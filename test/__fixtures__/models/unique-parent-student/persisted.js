const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const persisted = {

    [db.names.parentStudent.modelName]: [

        // 0. sample parent student
        {
            parent: new Types.ObjectId(),
            student: new Types.ObjectId()
        }

    ]

};

module.exports = persisted;