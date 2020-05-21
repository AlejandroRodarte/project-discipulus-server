const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session] - uniqueSession context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionContext.persisted));

    const unpersistedSessions = fixtures.models.uniqueSessionContext.unpersisted[shared.db.names.session.modelName];

    describe('[db/models/session] - class/title unique index', () => {

        it('Should not persist if class/title index is not unique', async () => {

            const sessionDoc = unpersistedSessions[0];
            const session = new db.models.Session(sessionDoc);

            await expect(session.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist if class/title index is unique', async () => {

            const sessionDoc = unpersistedSessions[1];
            const session = new db.models.Session(sessionDoc);

            await expect(session.save()).to.eventually.eql(session);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionContext.persisted));

});

describe('[db/models/session] - baseSession context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionContext.persisted));

    const persistedClassStudents = fixtures.models.baseSessionContext.persisted[shared.db.names.classStudent.modelName];
    const unpersistedSessions = fixtures.models.baseSessionContext.unpersisted[shared.db.names.session.modelName];

    describe('[db/models/session] - methods.saveAndAddStudents', () => {

        it('Should throw error if associated class does not exist', async () => {

            const sessionDoc = unpersistedSessions[0];
            const session = new db.models.Session(sessionDoc);

            await expect(session.saveAndAddStudents()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        });

        it('Should throw error if session.save fails (validation or non-uniqueness)', async () => {

            const sessionDoc = unpersistedSessions[1];
            const session = new db.models.Session(sessionDoc);

            await expect(session.saveAndAddStudents()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should return session doc instance and no sessionStudent docs if the class does not have students', async () => {

            const sessionDoc = unpersistedSessions[2];
            const session = new db.models.Session(sessionDoc);

            await expect(session.saveAndAddStudents()).to.eventually.eql([session, undefined]);

            const sessionStudents = await db.models.SessionStudent.find({
                session: session._id
            });

            expect(sessionStudents.length).to.equal(0);

        });

        it('Should generate session doc instance and sessionStudent docs to classStudents that have their accounts enabled', async () => {

            const sessionDoc = unpersistedSessions[3];
            const session = new db.models.Session(sessionDoc);

            const data = await session.saveAndAddStudents();

            expect(data[0]).to.eql(session);

            const sessionStudents = await db.models.SessionStudent.find({
                session: session._id
            });

            expect(sessionStudents.length).to.equal(3);
            expect(data[1].length).to.equal(3);

            const classStudentIds = sessionStudents.map(sessionStudent => sessionStudent.classStudent.toHexString());

            const enabledClassStudentIds = [
                persistedClassStudents[1]._id,
                persistedClassStudents[2]._id,
                persistedClassStudents[3]._id
            ].map(id => id.toHexString());

            expect(classStudentIds).to.have.members(enabledClassStudentIds);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionContext.persisted));

});

describe('[db/models/session] - baseSessionFile context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionFileContext.persisted));

    const persistedSessions = fixtures.models.baseSessionFileContext.persisted[shared.db.names.session.modelName];

    describe('[db/models/session] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated session files upon session removal', async () => {

            const sessionOneId = persistedSessions[0]._id;
            const sessionOne = await db.models.Session.findOne({ _id: sessionOneId });

            await sessionOne.remove();

            const docCount = await db.models.SessionFile.countDocuments({
                session: sessionOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionFileContext.persisted));

});

describe('[db/models/session] - baseSessionNote context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionNoteContext.persisted));

    const persistedSessions = fixtures.models.baseSessionNoteContext.persisted[shared.db.names.session.modelName];

    describe('[db/models/session] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated session notes upon session removal', async () => {

            const sessionOneId = persistedSessions[0]._id;
            const sessionOne = await db.models.Session.findOne({ _id: sessionOneId });

            await sessionOne.remove();

            const docCount = await db.models.SessionNote.countDocuments({
                session: sessionOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionNoteContext.persisted));

});

describe('[db/models/session] - baseSessionStudent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.baseSessionStudentContext.persisted));

    const persistedSessions = fixtures.models.baseSessionStudentContext.persisted[shared.db.names.session.modelName];

    describe('[db/models/session] - pre remove hook', () => {

        let deleteBucketObjectsStub;

        beforeEach(() => deleteBucketObjectsStub = sinon.stub(api.storage, 'deleteBucketObjects').resolves());

        it('Should delete all associated session students upon session removal', async () => {

            const sessionOneId = persistedSessions[0]._id;
            const sessionOne = await db.models.Session.findOne({ _id: sessionOneId });

            await sessionOne.remove();

            const docCount = await db.models.SessionStudent.countDocuments({
                session: sessionOne
            });

            expect(docCount).to.equal(0);

        });

        afterEach(() => {
            sinon.restore();
        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.baseSessionNoteContext.persisted));

});
