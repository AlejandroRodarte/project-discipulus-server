const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session-file] - uniqueSessionFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionFileContext.persisted));

    const unpersistedSessionFiles = fixtures.models.uniqueSessionFileContext.unpersisted[shared.db.names.sessionFile.modelName];

    describe('[db/models/session-file] - session/file.originalname index', () => {

        it('Should not persist non-unique session/file.originalname sessionFile', async () => {

            const sessionFileDoc = unpersistedSessionFiles[0];
            const sessionFile = new db.models.SessionFile(sessionFileDoc);

            await expect(sessionFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique session/file.originalname sessionFile', async () => {

            const sessionFileDoc = unpersistedSessionFiles[1];
            const sessionFile = new db.models.SessionFile(sessionFileDoc);

            await expect(sessionFile.save()).to.eventually.eql(sessionFile);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionFileContext.persisted));

});