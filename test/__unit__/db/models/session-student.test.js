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

const [classStudentDoc] = fixtures.functions.util.generateOneToMany('class', new Types.ObjectId(), [{ user: new Types.ObjectId() }]);

const [sessionDoc] = fixtures.functions.util.generateOneToMany('class', new Types.ObjectId(), [ fixtures.functions.models.generateFakeSession() ]);
const [sessionStudentDoc] = fixtures.functions.util.generateOneToMany('classStudent', classStudentDoc._id, [{ session: new Types.ObjectId() }]);

let classStudent = new db.models.ClassStudent(classStudentDoc);
let session = new db.models.Session(sessionDoc);
let sessionStudent = new db.models.SessionStudent(sessionStudentDoc);

beforeEach(() => {
    classStudent = fixtures.functions.models.getNewModelInstance(db.models.ClassStudent, classStudentDoc);
    session = fixtures.functions.models.getNewModelInstance(db.models.Session, sessionDoc);
    sessionStudent = fixtures.functions.models.getNewModelInstance(db.models.SessionStudent, sessionStudentDoc);
});

describe('[db/models/session-student] - Invalid classStudent _id', () => {

    it('Should not validate if classStudent _id is undefined', () => {
        sessionStudent.classStudent = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudent, db.schemas.definitions.sessionStudentDefinition.classStudent.required);
    });

});

describe('[db/models/session-student] - Invalid session', () => {

    it('Should not validate if session is undefined', () => {
        sessionStudent.session = undefined;
        fixtures.functions.models.testForInvalidModel(sessionStudent, db.schemas.definitions.sessionStudentDefinition.session.required);
    });

});

describe('[db/models/session-student] - Default write flag', () => {

    it('Should default write flag to false', () => {
        expect(sessionStudent.write).to.equal(false);
    });

});

describe('[db/models/session-student] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(sessionStudent);
    });

});

describe('[db/models/session-student] - methods.checkAndSave', () => {

    let sessionFindOneStub;
    let classStudentFindOneStub;
    let classStudentIsStudentEnabledStub;
    let sessionStudentSaveStub;

    it('Generated functions should call all required methods properly and resolve by returning sessionStudent doc instance', async () => {

        sessionFindOneStub = sinon.stub(db.models.Session, 'findOne').resolves(session);
        classStudentFindOneStub = sinon.stub(db.models.ClassStudent, 'findOne').resolves(classStudent);
        classStudentIsStudentEnabledStub = sinon.stub(classStudent, 'isStudentEnabled').resolves(true);
        sessionStudentSaveStub = sinon.stub(sessionStudent, 'save').resolves(sessionStudent);

        await expect(sessionStudent.checkAndSave()).to.eventually.eql(sessionStudent);

        sinon.assert.calledOnceWithExactly(sessionFindOneStub, {
            _id: sessionStudent.session
        });

        sinon.assert.calledOnceWithExactly(classStudentFindOneStub, {
            _id: sessionStudent.classStudent
        });

        sinon.assert.calledOnce(classStudentIsStudentEnabledStub);
        sinon.assert.calledOnce(sessionStudentSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
