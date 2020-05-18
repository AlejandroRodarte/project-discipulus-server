const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const classStudents = [
    // 0: sample class student
    ...util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }])
];

const classStudentNotes = [
    // 0-1: classStudent[0] with two notes
    ...util.generateOneToMany('classStudent', classStudents[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.classStudent.modelName]: classStudents,
    [db.names.classStudentNote.modelName]: classStudentNotes
};
