const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const shared = require('../../../../../src/shared');
const util = require('../../../../../src/util');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [classDoc] = fixtures.functions.util.generateOneToMany('user', new Types.ObjectId(), [ fixtures.functions.models.generateFakeClass() ]);
const [sessionDoc] = fixtures.functions.util.generateOneToMany('class', classDoc._id, [ fixtures.functions.models.generateFakeSession() ]);

const classStudentIds = [new Types.ObjectId(), new Types.ObjectId()];

const sessionStudentDocs = classStudentIds.map(classStudent => ({ session: sessionDoc._id, classStudent }));

let clazz = new db.models.Class(classDoc);
let session = new db.models.Session(sessionDoc);
let sessionStudents = sessionStudentDocs.map(sessionStudentDoc => new db.models.SessionStudent(sessionStudentDoc));

beforeEach(() => {
    clazz = fixtures.functions.models.getNewModelInstance(db.models.Class, classDoc);
    session = fixtures.functions.models.getNewModelInstance(db.models.Session, sessionDoc);
    sessionStudents = sessionStudentDocs.map(sessionStudentDoc => fixtures.functions.models.getNewModelInstance(db.models.SessionStudent, sessionStudentDoc));
});

describe('[util/models/common/generate-save-and-add-students] - general flow', () => {

    let classFindOneStub;
    let sessionSaveStub;
    let classGetEnabledStudentIdsStub;
    let sessionStudentInsertManyStub;

    it('Generated function should throw error if Class.findOne (called with correct args) resolves null', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(null);
        const saveAndAddStudents = util.models.common.generateSaveAndAddStudents({
            studentModelName: shared.db.names.sessionStudent.modelName,
            foreignField: 'session'
        }).bind(session);

        await expect(saveAndAddStudents()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.classNotFound);

        sinon.assert.calledOnceWithExactly(classFindOneStub, {
            _id: session.class
        });

    });

    it('Generated function should throw error if doc.save fails', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        sessionSaveStub = sinon.stub(session, 'save').rejects();

        const saveAndAddStudents = util.models.common.generateSaveAndAddStudents({
            studentModelName: shared.db.names.sessionStudent.modelName,
            foreignField: 'session'
        }).bind(session);

        await expect(saveAndAddStudents()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(sessionSaveStub);

    });

    it('Generated function should return array with model instance and undefined student children instances if class.getEnabledStudentIds fails', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        sessionSaveStub = sinon.stub(session, 'save').resolves(session);
        classGetEnabledStudentIdsStub = sinon.stub(clazz, 'getEnabledStudentIds').rejects();

        const saveAndAddStudents = util.models.common.generateSaveAndAddStudents({
            studentModelName: shared.db.names.sessionStudent.modelName,
            foreignField: 'session'
        }).bind(session);
        
        await expect(saveAndAddStudents()).to.eventually.eql([session, undefined]);

        sinon.assert.calledOnce(classGetEnabledStudentIdsStub);

    });

    it('Generated function should return array with model instance and undefined student children instances if StudentModel.insertMany (called with correct args) fails', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        sessionSaveStub = sinon.stub(session, 'save').resolves(session);
        classGetEnabledStudentIdsStub = sinon.stub(clazz, 'getEnabledStudentIds').resolves(classStudentIds);
        sessionStudentInsertManyStub = sinon.stub(db.models.SessionStudent, 'insertMany').rejects();

        const saveAndAddStudents = util.models.common.generateSaveAndAddStudents({
            studentModelName: shared.db.names.sessionStudent.modelName,
            foreignField: 'session'
        }).bind(session);
        
        await expect(saveAndAddStudents()).to.eventually.eql([session, undefined]);

        sinon.assert.calledOnceWithExactly(sessionStudentInsertManyStub, sessionStudentDocs);

    });

    it('Generated function should return array with model instance and student children instances if all tasks resolve', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        sessionSaveStub = sinon.stub(session, 'save').resolves(session);
        classGetEnabledStudentIdsStub = sinon.stub(clazz, 'getEnabledStudentIds').resolves(classStudentIds);
        sessionStudentInsertManyStub = sinon.stub(db.models.SessionStudent, 'insertMany').resolves(sessionStudents);

        const saveAndAddStudents = util.models.common.generateSaveAndAddStudents({
            studentModelName: shared.db.names.sessionStudent.modelName,
            foreignField: 'session'
        }).bind(session);
        
        await expect(saveAndAddStudents()).to.eventually.eql([session, sessionStudents]);

    });

    afterEach(() => {
        sinon.restore();
    });

});
