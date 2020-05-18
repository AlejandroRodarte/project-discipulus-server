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

const classStudentFileDoc = {
    classStudent: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeFile()
};

let classStudentFile = new db.models.ClassStudentFile(classStudentFileDoc);

beforeEach(() => classStudentFile = fixtures.functions.models.getNewModelInstance(db.models.ClassStudentFile, classStudentFileDoc));

describe('[db/models-class-student-file] - Invalid class-student', () => {

    it('Should not validate if class-student id is undefined', () => {
        classStudentFile.classStudent = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentFile, db.schemas.definitions.classStudentFileDefinition.classStudent.required);
    });

});

describe('[db/models-class-student-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        classStudentFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentFile, db.schemas.definitions.classStudentFileDefinition.file.required);
    });

});

describe('[db/models-class-student-file] - Valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(classStudentFile);
    });

});

describe('[db/models/class-student-file] - methods.saveFileAndDoc', () => {

    let classStudentExistsStub;
    let classStudentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return class-student-file doc', async () => {

        classStudentExistsStub = sinon.stub(db.models.ClassStudent, 'exists').resolves(true);
        classStudentFileSaveStub = sinon.stub(classStudentFile, 'save').resolves(classStudentFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(classStudentFile);

        sinon.assert.calledOnceWithExactly(classStudentExistsStub, {
            _id: classStudentFile.classStudent
        });

        sinon.assert.calledOnce(classStudentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.classStudentFile.modelName], {
            keyname: classStudentFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: classStudentFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
