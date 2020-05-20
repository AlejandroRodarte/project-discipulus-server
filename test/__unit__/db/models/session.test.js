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

describe('[db/models/session] - invalid class _id', () => {

    it('Should not validate if class _id is undefined', () => {
        session.class = undefined;
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.class.required);
    });

});

describe('[db/models/session] - invalid session title', () => {

    const [sesionTitleMinLength] = db.schemas.definitions.sessionDefinition.title.minlength;
    const [sesionTitleMaxLength] = db.schemas.definitions.sessionDefinition.title.maxlength;

    it('Should not validate if session title is undefined', () => {
        session.title = undefined;
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.title.required);
    });

    it('Should not validate if session title has bad words', () => {
        session.title = 'Ass nibba';
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.title.validate);
    });

    it(`Should not validate if session title is shorter than ${ sesionTitleMinLength } characters`, () => {
        session.title = 'O';
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.title.minlength);
    });

    it(`Should not validate if session title is longer than ${ sesionTitleMaxLength } characters`, () => {
        session.title = fixtures.util.lorem.generateWords(15);
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.title.maxlength);
    });

});

describe('[db/models/session] - valid session title', () => {

    it('Should trim redundant white spaces on session title', () => {

        session.title = '   This is   about   glory    !!!  ';
        fixtures.functions.models.testForValidModel(session);

        expect(session.title).to.equal('This is about glory !!!');

    });

});

describe('[db/models/session] - undefined session description', () => {

    it('Should validate if session description does not exist', () => {
        session.description = undefined;
        fixtures.functions.models.testForValidModel(session);
    });

});

describe('[db/models/session] - invalid session description', () => {

    const [sessionDescriptionMaxLength] = db.schemas.definitions.sessionDefinition.description.maxlength;

    it('Should not validate if session description has bad words', () => {
        session.description = 'So this live session if about my bitch';
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.description.validate);
    });

    it(`Should not validate if session description is longer than ${ sessionDescriptionMaxLength } characters`, () => {
        session.description = fixtures.util.lorem.generateWords(250);
        fixtures.functions.models.testForInvalidModel(session, db.schemas.definitions.sessionDefinition.description.maxlength);
    });

});

describe('[db/models/session] - valid session description', () => {

    it('Should trim redundant white spaces on session description', () => {

        session.description = '   For    America   best    hole ';
        fixtures.functions.models.testForValidModel(session);

        expect(session.description).to.equal('For America best hole');

    });

});

describe('[db/models/session] - Default live flag', () => {

    it('Should default live session flag to true', () => {
        expect(session.live).to.equal(true);
    });

});

describe('[db/models/session] - methods.saveAndAddStudents', () => {

    let classFindOneStub;
    let sessionSaveStub;
    let classGetEnabledStudentIdsStub;
    let sessionStudentInsertManyStub;

    it('Generated function should call all functions with the correct args and return instance doc and child student docs in array', async () => {

        classFindOneStub = sinon.stub(db.models.Class, 'findOne').resolves(clazz);
        sessionSaveStub = sinon.stub(session, 'save').resolves(session);
        classGetEnabledStudentIdsStub = sinon.stub(clazz, 'getEnabledStudentIds').resolves(classStudentIds);
        sessionStudentInsertManyStub = sinon.stub(db.models.SessionStudent, 'insertMany').resolves(sessionStudents);

        await expect(session.saveAndAddStudents()).to.eventually.eql([session, sessionStudents]);

        sinon.assert.calledOnceWithExactly(classFindOneStub, {
            _id: session.class
        });

        sinon.assert.calledOnce(sessionSaveStub);
        sinon.assert.calledOnce(classGetEnabledStudentIdsStub);
        
        sinon.assert.calledOnceWithExactly(sessionStudentInsertManyStub, sessionStudentDocs);

    });

    afterEach(() => {
        sinon.restore();
    });

});
