const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const sessionStudents = [
    // 0: generate one sample session student
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ classStudent: new Types.ObjectId() }])
];

const sessionStudentNotes = [
    // 0: sessionStudent[0] with sample note
    ...util.generateOneToMany('sessionStudent', sessionStudents[0]._id, [{ note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.sessionStudent.modelName]: sessionStudents,
    [db.names.sessionStudentNote.modelName]: sessionStudentNotes
};
