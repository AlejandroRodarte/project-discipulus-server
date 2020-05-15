const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { Class, ClassFile } = require('../../../../src/db/models');
const { classFileDefinition } = require('../../../../src/db/schemas/class-file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classFileDoc = {
    class: new Types.ObjectId(),
    file: modelFunctions.generateFakeFile()
};

let classFile = new ClassFile(classFileDoc);

beforeEach(() => classFile = modelFunctions.getNewModelInstance(ClassFile, classFileDoc));

describe('[db/models/class-file] - Invalid class', () => {

    it('Should not validate if class id is undefined', () => {
        classFile.class = undefined;
        modelFunctions.testForInvalidModel(classFile, classFileDefinition.class.required);
    });

});

describe('[db/models/class-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        classFile.file = undefined;
        modelFunctions.testForInvalidModel(classFile, classFileDefinition.file.required);
    });

});

describe('[db/models/class-file] - Default published', () => {

    it('Should default published flag to false', () => {
        expect(classFile.published).to.equal(false);
    });

});

describe('[db/models/class-file] - Valid model', () => {

    it('Should validate correct model', () => {
        modelFunctions.testForValidModel(classFile);
    });

});

describe('[db/models/class-file] - methods.saveFileAndDoc', () => {

    let classExistsStub;
    let classFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return class-file doc', async () => {

        classExistsStub = sinon.stub(Class, 'exists').resolves(true);
        classFileSaveStub = sinon.stub(classFile, 'save').resolves(classFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(classFile.saveFileAndDoc(buffer)).to.eventually.eql(classFile);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classFile.class
        });

        sinon.assert.calledOnce(classFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.classFile.modelName], {
            keyname: classFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: classFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
