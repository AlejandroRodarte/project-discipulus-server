const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const classStudents = [
    // 0: generate one sample class student
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentNotes = [
    // 0: classStudent[0] with sample note
    ...util.generateOneToMany('classStudent', classStudents[0]._id, [{ note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.classStudent.modelName]: classStudents,
    [db.names.classStudentNote.modelName]: classStudentNotes
};
