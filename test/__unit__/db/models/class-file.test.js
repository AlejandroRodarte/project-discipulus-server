const { Types } = require('mongoose');
const expect = require('chai').expect;

const { ClassFile } = require('../../../../src/db/models');
const { classFileDefinition } = require('../../../../src/db/schemas/class-file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const classFileDoc = {
    class: new Types.ObjectId(),
    file: modelFunctions.generateFakeFile()
};

let classFile = new ClassFile(classFileDoc);

beforeEach(() => classFile = modelFunctions.getNewModelInstance(ClassFile, classFileDoc));


