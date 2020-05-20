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
