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

describe('[db/models-class-file] - Invalid class', () => {

    it('Should not validate if class id is undefined', () => {
        classFile.class = undefined;
        modelFunctions.testForInvalidModel(classFile, classFileDefinition.class.required);
    });

});

describe('[db/models-class-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        classFile.file = undefined;
        modelFunctions.testForInvalidModel(classFile, classFileDefinition.file.required);
    });

});

describe('[db/models-class-file] - Default published', () => {

    it('Should default published flag to false', () => {
        expect(classFile.published).to.equal(false);
    });

});

describe('[db/models-class-file] - Valid model', () => {

    it('Should validate correct model', () => {
        modelFunctions.testForValidModel(classFile);
    });

});

