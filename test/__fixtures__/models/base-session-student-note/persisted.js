const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const sessionStudents = [
    // 0: sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }])
];

const sessionStudentNotes = [
    // 0-1: sessionStudent[0] with two notes
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents,
    [db.names.sessionStudentNote.modelName]: sessionStudentNotes
};
