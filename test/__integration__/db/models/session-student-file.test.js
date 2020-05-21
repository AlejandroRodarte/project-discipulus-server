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