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

describe('[db/models/session-file] - saveSessionFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveSessionFileContext.persisted));

    const unpersistedSessionFiles = fixtures.modelsStorage.saveSessionFileContext.unpersisted.db[shared.db.names.sessionFile.modelName];

    describe('[db/models/session-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated session does not exist', async () => {

            const sessionFileDoc = unpersistedSessionFiles[0];
            const sessionFile = new db.models.SessionFile(sessionFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionFile.file.originalname);

            await expect(sessionFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.sessionNotFound);

        });

        it('Should not upload file if session-file fails on model instance save (non-unique)', async () => {

            const sessionFileDoc = unpersistedSessionFiles[1];
            const sessionFile = new db.models.SessionFile(sessionFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionFile.file.originalname);

            await expect(sessionFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct session file', async () => {

            const sessionFileDoc = unpersistedSessionFiles[2];
            const sessionFile = new db.models.SessionFile(sessionFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionFile.file.originalname);

            await expect(sessionFile.saveFileAndDoc(buffer)).to.eventually.eql(sessionFile);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.sessionFile.modelName], sessionFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(sessionFile.file.mimetype);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveSessionFileContext.persisted));

});
