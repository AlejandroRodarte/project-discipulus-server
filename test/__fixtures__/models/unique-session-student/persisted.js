const { Types } = require('mongoose');

const { db } = require('../../../../src/shared');

const { util } = require('../../functions');

const sessionStudents = [
    // 0. sample session student
    ...util.generateOneToMany('classStudent', new Types.ObjectId(), [{ session: new Types.ObjectId() }])
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents
};
