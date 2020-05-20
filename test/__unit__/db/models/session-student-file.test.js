const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [sessionStudentFileDoc] = fixtures.functions.util.generateOneToMany('sessionStudent', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

beforeEach(() => sessionStudentFile = fixtures.functions.models.getNewModelInstance(db.models.SessionStudentFile, sessionStudentFileDoc));

describe('[db/models/session-student-file] - Invalid sessionStudent _id', () => {

    it('Should not validate if sessionStudent _id is undefined', () => {
        sessionStudentFile.sessionStudent = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudentFile, db.schemas.definitions.sessionStudentFileDefinition.sessionStudent.required);
    });

});

describe('[db/models/session-student-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        sessionStudentFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudentFile, db.schemas.definitions.sessionStudentFileDefinition.file.required);
    });

});

describe('[db/models/session-student-file] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(sessionStudentFile);
    });

});

describe('[db/models/session-student-file] - methods.saveFileAndDoc', () => {

    let sessionStudentExistsStub;
    let sessionStudentFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return session-student-file doc', async () => {

        sessionStudentExistsStub = sinon.stub(db.models.SessionStudent, 'exists').resolves(true);
        sessionStudentFileSaveStub = sinon.stub(sessionStudentFile, 'save').resolves(sessionStudentFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(sessionStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(sessionStudentFile);

        sinon.assert.calledOnceWithExactly(sessionStudentExistsStub, {
            _id: sessionStudentFile.sessionStudent
        });

        sinon.assert.calledOnce(sessionStudentFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.sessionStudentFile.modelName], {
            keyname: sessionStudentFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: sessionStudentFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
