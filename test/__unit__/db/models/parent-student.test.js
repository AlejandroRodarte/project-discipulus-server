const { Types } = require('mongoose');

const ParentStudent = require('../../../../src/db/models/parent-student');
const { parentStudentDefinition } = require('../../../../src/db/schemas/parent-student');
const modelFunctions = require('../../../__fixtures__/functions/models');

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

let parentStudent = new ParentStudent(parentStudentDoc);

beforeEach(() => parentStudent = modelFunctions.getNewModelInstance(ParentStudent, parentStudentDoc));

describe('[db/models/parent-student] - invalid parent', () => {

    it('Should not validate parent-student if a parent id is not defined', () => {
        parentStudent.parent = undefined;
        modelFunctions.testForInvalidModel(parentStudent, parentStudentDefinition.parent.required);
    });

});

describe('[db/models/parent-student] - invalid student', () => {

    it('Should not validate parent-student if a student id is not defined', () => {
        parentStudent.student = undefined;
        modelFunctions.testForInvalidModel(parentStudent, parentStudentDefinition.student.required);
    });

});

describe('[db/models/parent-student - valid parent-student]', () => {

    it('Should validate parent-student with correct ids', () => {
        modelFunctions.testForValidModel(parentStudent);
    });

});
