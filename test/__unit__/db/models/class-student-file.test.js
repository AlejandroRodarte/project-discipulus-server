const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { ClassStudent, ClassStudentFile } = require('../../../../src/db/models');
const { classStudentFileDefinition } = require('../../../../src/db/schemas/class-student-file');
const modelFunctions = require('../../../__fixtures__/functions/models');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

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

describe('[db/models/class-student-file] - methods.saveFileAndDoc', () => {

    let classStudentExistsStub;
    let classStudentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return class-student-file doc', async () => {

        classStudentExistsStub = sinon.stub(ClassStudent, 'exists').resolves(true);
        classStudentFileSaveStub = sinon.stub(classStudentFile, 'save').resolves(classStudentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(classStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(classStudentFile);

        sinon.assert.calledOnceWithExactly(classStudentExistsStub, {
            _id: classStudentFile.classStudent
        });

        sinon.assert.calledOnce(classStudentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.classStudentFile.modelName], {
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
