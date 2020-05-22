const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const util = require('../../../../../src/util');
const shared = require('../../../../../src/shared');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [classStudentDoc] = fixtures.functions.util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }]);

const [sessionDoc] = fixtures.functions.util.generateOneToMany('class', new Types.ObjectId(), [ fixtures.functions.models.generateFakeSession() ]);
const [sessionStudentDoc] = fixtures.functions.util.generateOneToMany('classStudent', classStudentDoc._id, [{ session: new Types.ObjectId() }]);

let classStudent = new db.models.ClassStudent(classStudentDoc);
let session = new db.models.Session(sessionDoc);
let sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

const checkAndSaveArgs = {
    local: {
        modelName: shared.db.names.classStudent.modelName,
        ref: 'classStudent',
        notFoundErrorMessage: util.errors.modelErrorMessages.classStudentNotFound
    },
    foreign: {
        modelName: shared.db.names.session.modelName,
        ref: 'session',
        notFoundErrorMessage: util.errors.modelErrorMessages.sessionNotFound
    }
};

beforeEach(() => {
    classStudent = fixtures.functions.models.getNewModelInstance(db.models.ClassStudent, classStudentDoc);
    session = fixtures.functions.models.getNewModelInstance(db.models.Session, sessionDoc);
    sessionStudent = fixtures.functions.models.getNewModelInstance(db.models.SessionStudent, sessionStudentDoc);
});

describe('[util/models/common-generate-class-child-check-and-save] - general flow', () => {

    let sessionFindOneStub;
    let classStudentFindOneStub;
    let sessionStudentSaveStub;
    let validateFake;

    it('Generated function should throw error if ForeignModel.findOne (called with correct args) resolves null', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(null);
        validateFake = sinon.fake.resolves();

        const checkAndSave = util.models.common.generateClassChildCheckAndSave({
            ...checkAndSaveArgs,
            validate: validateFake
        }).bind(sessionStudent);

        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error, checkAndSaveArgs.foreign.notFoundErrorMessage);

        sinon.assert.calledOnceWithExactly(sessionFindOneStub, {
            _id: sessionStudent.session
        });

    });

    it('Generated function should throw error if LocalModel.findOne (called with correct args) resolves null', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(session);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(null);
        validateFake = sinon.fake.resolves();

        const checkAndSave = util.models.common.generateClassChildCheckAndSave({
            ...checkAndSaveArgs,
            validate: validateFake
        }).bind(sessionStudent);

        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error, checkAndSaveArgs.local.notFoundErrorMessage);
        
        sinon.assert.calledOnceWithExactly(classStudentFindOneStub, {
            _id: sessionStudent.classStudent
        });

    });

    it('Generated function should throw error if validate callback fails', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(session);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        validateFake = sinon.fake.rejects();

        const checkAndSave = util.models.common.generateClassChildCheckAndSave({
            ...checkAndSaveArgs,
            validate: validateFake
        }).bind(sessionStudent);

        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(validateFake, classStudent, session, sessionStudent);

    });

    it('Generated function should throw error if doc.save fails', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(session);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        validateFake = sinon.fake.resolves();
        sessionStudentSaveStub = sinon.stub(sessionStudent, 'save').rejects();

        const checkAndSave = util.models.common.generateClassChildCheckAndSave({
            ...checkAndSaveArgs,
            validate: validateFake
        }).bind(sessionStudent);

        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Generated function should return doc instance if all tasks resolve', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(session);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        validateFake = sinon.fake.resolves();
        sessionStudentSaveStub = sinon.stub(sessionStudent, 'save').resolves(sessionStudent);

        const checkAndSave = util.models.common.generateClassChildCheckAndSave({
            ...checkAndSaveArgs,
            validate: validateFake
        }).bind(sessionStudent);

        await expect(checkAndSave()).to.eventually.be.eql(sessionStudent);

        sinon.assert.calledOnce(sessionStudentSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
