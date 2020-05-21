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

describe('[db/models/session-student-file] - uniqueSessionStudentFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionStudentFileContext.persisted));

    const unpersistedStudentSessionFiles = fixtures.models.uniqueSessionStudentFileContext.unpersisted[shared.db.names.sessionStudentFile.modelName];

    describe('[db/models/session-student-file] - sessionStudent/file.originalname index', () => {

        it('Should not persist non-unique sessionStudent/file.originalname sessionStudentFile', async () => {

            const sessionStudentFileDoc = unpersistedStudentSessionFiles[0];
            const sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

            await expect(sessionStudentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist unique sessionStudent/file.originalname sessionStudentFile', async () => {

            const sessionStudentFileDoc = unpersistedStudentSessionFiles[1];
            const sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

            await expect(sessionStudentFile.save()).to.eventually.eql(sessionStudentFile);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionStudentFileContext.persisted));

});

describe('[db/models/session-student-file] - saveSessionStudentFile context', function() {

    this.timeout(20000);

    this.beforeEach(fixtures.functions.dbStorage.init(fixtures.modelsStorage.saveSessionStudentFileContext.persisted));

    const unpersistedSessionStudentFiles = fixtures.modelsStorage.saveSessionStudentFileContext.unpersisted.db[shared.db.names.sessionStudentFile.modelName];

    describe('[db/models/session-student-file] - methods.saveFileAndDoc', () => {

        it('Should not upload file if associated session-student does not exist', async () => {

            const sessionStudentFileDoc = unpersistedSessionStudentFiles[0];
            const sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionStudentFile.file.originalname);

            await expect(sessionStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.sessionStudentNotFound);

        });

        it('Should not upload file if session-student-file fails on model instance save (non-unique)', async () => {

            const sessionStudentFileDoc = unpersistedSessionStudentFiles[1];
            const sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionStudentFile.file.originalname);

            await expect(sessionStudentFile.saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should properly upload correct session file', async () => {

            const sessionStudentFileDoc = unpersistedSessionStudentFiles[2];
            const sessionStudentFile = new db.models.SessionStudentFile(sessionStudentFileDoc);

            const buffer = fixtures.functions.assets.getAssetBuffer(sessionStudentFile.file.originalname);

            await expect(sessionStudentFile.saveFileAndDoc(buffer)).to.eventually.eql(sessionStudentFile);

            const res = await api.storage.getMultipartObject(api.storage.config.bucketNames[shared.db.names.sessionStudentFile.modelName], sessionStudentFile.file.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.equal(sessionStudentFile.file.mimetype);

        });

    });

    this.afterEach(fixtures.functions.dbStorage.teardown(fixtures.modelsStorage.saveSessionStudentFileContext.persisted));

});
