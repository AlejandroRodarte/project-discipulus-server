const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classFileDoc = {
    class: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeFile()
};

let classFile = new db.models.ClassFile(classFileDoc);

beforeEach(() => classFile = fixtures.functions.models.getNewModelInstance(db.models.ClassFile, classFileDoc));

describe('[db/models/class-file] - Invalid class', () => {

    it('Should not validate if class id is undefined', () => {
        classFile.class = undefined;
        fixtures.functions.models.testForInvalidModel(classFile, db.schemas.definitions.classFileDefinition.class.required);
    });

});

describe('[db/models/class-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        classFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(classFile, db.schemas.definitions.classFileDefinition.file.required);
    });

});

describe('[db/models/class-file] - Default published', () => {

    it('Should default published flag to false', () => {
        expect(classFile.published).to.equal(false);
    });

});

describe('[db/models/class-file] - Valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(classFile);
    });

});

describe('[db/models/class-file] - methods.saveFileAndDoc', () => {

    let classExistsStub;
    let classFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return class-file doc', async () => {

        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(true);
        classFileSaveStub = sinon.stub(classFile, 'save').resolves(classFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(classFile.saveFileAndDoc(buffer)).to.eventually.eql(classFile);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classFile.class
        });

        sinon.assert.calledOnce(classFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.classFile.modelName], {
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
