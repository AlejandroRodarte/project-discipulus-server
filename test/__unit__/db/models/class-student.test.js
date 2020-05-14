const { Types } = require('mongoose');
const expect = require('chai').expect;

const { ClassStudent } = require('../../../../src/db/models');
const { classStudentDefinition } = require('../../../../src/db/schemas/class-student');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classStudentDoc = {
    class: new Types.ObjectId(),
    user: new Types.ObjectId()
};

let classStudent = new ClassStudent(classStudentDoc);

beforeEach(() => classStudent = modelFunctions.getNewModelInstance(ClassStudent, classStudentDoc));

describe('[db/models/class-student] - Invalid class', () => {

    it('Should not validate if class-student does not include a class _id', () => {
        classStudent.class = undefined;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.class.required);
    });

});

describe('[db/models/class-student] - Invalid user', () => {

    it('Should not validate if class-student does not include a user _id', () => {
        classStudent.user = undefined;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.user.required);
    });

});

describe('[db/models/class-student] - Default grade', () => {

    it('Should default grade to 0 if not specified', () => {
        expect(classStudent.grade).to.equal(0);
    });

});

describe('[db/models/class-student] - Invalid grade', () => {

    const [minGrade] = classStudentDefinition.grade.min;
    const [maxGrade] = classStudentDefinition.grade.max;

    it(`Should not validate grade lower than ${ minGrade }`, () => {
        classStudent.grade = -10;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.grade.min);
    });

    it(`Should not validate grade higher than ${ maxGrade }`, () => {
        classStudent.grade = 110;
        modelFunctions.testForInvalidModel(classStudent, classStudentDefinition.grade.max);
    });

});

describe('[db/models/class-student] - Default write', () => {

    it('Should default write flag to false', () => {
        expect(classStudent.write).to.equal(false);
    });

});

describe('[db/models/class-student] - Default archive', () => {

    it('Should default archive flag to false', () => {
        expect(classStudent.archive).to.equal(false);
    });

});

describe('[db/models/class-student] - Valid model', () => {

    it('Should validate correct class-student model', () => {
        modelFunctions.testForValidModel(classStudent);
    });

});
