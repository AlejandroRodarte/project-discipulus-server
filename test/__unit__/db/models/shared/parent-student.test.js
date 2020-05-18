const { Types } = require('mongoose');

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

let parentStudent = new db.models.shared.ParentStudent(parentStudentDoc);

beforeEach(() => parentStudent = fixtures.functions.models.getNewModelInstance(db.models.shared.ParentStudent, parentStudentDoc));

describe('[db/models/shared/parent-student] - invalid parent', () => {

    it('Should not validate parent-student if a parent id is not defined', () => {
        parentStudent.parent = undefined;
        fixtures.functions.models.testForInvalidModel(parentStudent, db.schemas.shared.definitions.sharedParentStudentDefinition.parent.required);
    });

});

describe('[db/models/shared/parent-student] - invalid student', () => {

    it('Should not validate parent-student if a student id is not defined', () => {
        parentStudent.student = undefined;
        fixtures.functions.models.testForInvalidModel(parentStudent, db.schemas.shared.definitions.sharedParentStudentDefinition.student.required);
    });

});

describe('[db/models/shared/parent-student] - valid parent-student', () => {

    it('Should validate parent-student with correct ids', () => {
        fixtures.functions.models.testForValidModel(parentStudent);
    });

});
