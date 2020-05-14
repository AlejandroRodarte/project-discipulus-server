const { Types } = require('mongoose');
const expect = require('chai').expect;

const { ClassStudentFile } = require('../../../../src/db/models');
const { classStudentFileDefinition } = require('../../../../src/db/schemas/class-student-file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classStudentFileDoc = {
    class: new Types.ObjectId(),
    file: modelFunctions.generateFakeFile()
};

let classStudentFile = new ClassStudentFile(classStudentFileDoc);

beforeEach(() => classStudentFile = modelFunctions.getNewModelInstance(ClassStudentFile, classStudentFileDoc));


