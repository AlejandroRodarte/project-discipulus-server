const { Types } = require('mongoose');

const { sharedParentStudentDefinition } = require('../../../../../src/db/schemas/shared/parent-student');
const { testForInvalidModel, testForValidModel, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { ParentStudent } = require('../../../../../src/db/models/shared');

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

let parentStudent = new ParentStudent(parentStudentDoc);

beforeEach(() => parentStudent = getNewModelInstance(ParentStudent, parentStudentDoc));

describe('[db/models/parent-student] - invalid parent', () => {

    it('Should not validate parent-student if a parent id is not defined', () => {
        parentStudent.parent = undefined;
        testForInvalidModel(parentStudent, sharedParentStudentDefinition.parent.required);
    });

});

describe('[db/models/parent-student] - invalid student', () => {

    it('Should not validate parent-student if a student id is not defined', () => {
        parentStudent.student = undefined;
        testForInvalidModel(parentStudent, sharedParentStudentDefinition.student.required);
    });

});

describe('[db/models/parent-student] - valid parent-student', () => {

    it('Should validate parent-student with correct ids', () => {
        testForValidModel(parentStudent);
    });

});
