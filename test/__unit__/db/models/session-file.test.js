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

const [sessionFileDoc] = fixtures.functions.util.generateOneToMany('session', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let sessionFile = new db.models.SessionFile(sessionFileDoc);

beforeEach(() => sessionFile = fixtures.functions.models.getNewModelInstance(db.models.SessionFile, sessionFileDoc));

describe('[db/models/session-file] - Invalid session _id', () => {

    it('Should not validate if session _id is undefined', () => {
        sessionFile.session = undefined;
        fixtures.functions.models.testForInvalidModel(sessionFile, db.schemas.definitions.sessionFileDefinition.session.required);
    });

});

describe('[db/models/session-file] - Invalid file', () => {

    it('Should not validate if file is undefined', () => {
        sessionFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(sessionFile, db.schemas.definitions.sessionFileDefinition.file.required);
    });

});

describe('[db/models/session-file] - Default published flag', () => {

    it('Should default published flag to false', () => {
        expect(sessionFile.published).to.equal(false);
    });

});

describe('[db/models/session-file] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(sessionFile);
    });

});

describe('[db/models/session-file] - methods.saveFileAndDoc', () => {

    let sessionExistsStub;
    let sessionFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated function should call methods with correct args and return session-file doc', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        sessionFileSaveStub = sinon.stub(sessionFile, 'save').resolves(sessionFile);
        createMultipartObjectStub = sinon.stub(api.storage, 'createMultipartObject').resolves();

        await expect(sessionFile.saveFileAndDoc(buffer)).to.eventually.eql(sessionFile);

        sinon.assert.calledOnceWithExactly(sessionExistsStub, {
            _id: sessionFile.session
        });

        sinon.assert.calledOnce(sessionFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, api.storage.config.bucketNames[shared.db.names.sessionFile.modelName], {
            keyname: sessionFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: sessionFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
