const { Types } = require('mongoose');
const expect = require('chai').expect;

const { ClassStudentFile } = require('../../../../src/db/models');
const { classStudentFileDefinition } = require('../../../../src/db/schemas/class-student-file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classStudentFileDoc = {
    classStudent: new Types.ObjectId(),
    file: modelFunctions.generateFakeFile()
};

let classStudentFile = new ClassStudentFile(classStudentFileDoc);

beforeEach(() => classStudentFile = modelFunctions.getNewModelInstance(ClassStudentFile, classStudentFileDoc));

describe('[db/models-class-student-file] - Invalid class-student', () => {

    it('Should not validate if class-student id is undefined', () => {
        classStudentFile.classStudent = undefined;
        modelFunctions.testForInvalidModel(classStudentFile, classStudentFileDefinition.classStudent.required);
    });

});

describe('[db/models-class-student-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        classStudentFile.file = undefined;
        modelFunctions.testForInvalidModel(classStudentFile, classStudentFileDefinition.file.required);
    });

});

describe('[db/models-class-student-file] - Valid model', () => {

    it('Should validate correct model', () => {
        modelFunctions.testForValidModel(classStudentFile);
    });

});
