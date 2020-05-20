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
const [sessionStudentDoc] = fixtures.functions.util.generateOneToMany('classStudent', classStudentDoc._id, [{ session: new Types.ObjectId() }]);

let classStudent = new db.models.ClassStudent(classStudentDoc);
let sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

const checkAndSaveArgs = {
    foreignModel: {
        name: shared.db.names.session.modelName,
        ref: 'session',
        notFoundErrorMessage: util.errors.modelErrorMessages.sessionNotFound
    }
};

beforeEach(() => {
    classStudent = fixtures.functions.models.getNewModelInstance(db.models.ClassStudent, classStudentDoc);
    sessionStudent = fixtures.functions.models.getNewModelInstance(db.models.SessionStudent, sessionStudentDoc);
});

describe('[util/models/common-generate-class-student-child-check-and-save] - general flow', () => {

    let sessionExistsStub;
    let classStudentFindOneStub;
    let classStudentIsStudentEnabledStub;
    let sessionStudentSaveStub;

    it('Generated function should throw error if ForeignModel.exists (called with correct args) resolves false', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(false);

        const checkAndSave = util.models.common.generateClassStudentChildCheckAndSave(checkAndSaveArgs).bind(sessionStudent);
        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error, checkAndSaveArgs.foreignModel.notFoundErrorMessage);

        sinon.assert.calledOnceWithExactly(sessionExistsStub, {
            _id: sessionStudent.session
        });

    });

    it('Generated function should throw error if ClassStudent.findOne (called with correct args) resolves null', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(null);

        const checkAndSave = util.models.common.generateClassStudentChildCheckAndSave(checkAndSaveArgs).bind(sessionStudent);
        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classStudentNotFound);
        
        sinon.assert.calledOnceWithExactly(classStudentFindOneStub, {
            _id: sessionStudent.classStudent
        });

    });

    it('Generated function should throw error if classStudent.isStudentEnabled resolves false', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        classStudentIsStudentEnabledStub = sinon.stub(classStudent, 'isStudentEnabled').resolves(false);

        const checkAndSave = util.models.common.generateClassStudentChildCheckAndSave(checkAndSaveArgs).bind(sessionStudent);
        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userDisabled);

        sinon.assert.calledOnce(classStudentIsStudentEnabledStub);

    });

    it('Generated function should throw error if doc.save fails', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        classStudentIsStudentEnabledStub = sinon.stub(classStudent, 'isStudentEnabled').resolves(true);
        sessionStudentSaveStub = sinon.stub(sessionStudent, 'save').rejects();

        const checkAndSave = util.models.common.generateClassStudentChildCheckAndSave(checkAndSaveArgs).bind(sessionStudent);
        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Generated function should return doc instance if all tasks resolve', async () => {

        sessionExistsStub = sinon.stub(db.models.Session, 'exists').resolves(true);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        classStudentIsStudentEnabledStub = sinon.stub(classStudent, 'isStudentEnabled').resolves(true);
        sessionStudentSaveStub = sinon.stub(sessionStudent, 'save').resolves(sessionStudent);

        const checkAndSave = util.models.common.generateClassStudentChildCheckAndSave(checkAndSaveArgs).bind(sessionStudent);
        await expect(checkAndSave()).to.eventually.be.eql(sessionStudent);

        sinon.assert.calledOnce(sessionStudentSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
