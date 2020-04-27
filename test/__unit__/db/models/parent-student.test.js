const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { parentStudentDefinition } = require('../../../../src/db/schemas/parent-student');
const { testForInvalidModel, testForValidModel, generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudent } = require('../../../../src/db/models');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

let parentStudent = new ParentStudent(parentStudentDoc);

beforeEach(() => parentStudent = getNewModelInstance(ParentStudent, parentStudentDoc));

describe('[db/models/parent-student] - invalid parent', () => {

    it('Should not validate parent-student if a parent id is not defined', () => {
        parentStudent.parent = undefined;
        testForInvalidModel(parentStudent, parentStudentDefinition.parent.required);
    });

});

describe('[db/models/parent-student] - invalid student', () => {

    it('Should not validate parent-student if a student id is not defined', () => {
        parentStudent.student = undefined;
        testForInvalidModel(parentStudent, parentStudentDefinition.student.required);
    });

});

describe('[db/models/parent-student - valid parent-student]', () => {

    it('Should validate parent-student with correct ids', () => {
        testForValidModel(parentStudent);
    });

});

describe('[db/models/parent-student - add]', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    let userFindOneStub;
    let userHasRoleStub;
    let userSaveStub;

    it('Should call User.findOne with correct args', () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(null);
        
        ParentStudent.add(parentStudent);
    
        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentStudent.parent,
            enabled: true
        });

    });

    it('Should throw error if User.findOne resolves null user', async () => {
        userFindOneStub = sandbox.stub(User, 'findOne').resolves(null);
        await expect(ParentStudent.add(parentStudent)).to.eventually.be.rejectedWith(Error);
    });

    it('Should throw error if parent.hasRole resolves to false', async () => {

        const [userDoc] = generateFakeUsers(1, {
            fakeToken: true
        });
        
        const user = new User(userDoc);

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(false);

        await expect(ParentStudent.add(parentStudent)).to.eventually.be.rejectedWith(Error);

    });

    afterEach(() => {
        sandbox.restore();
    });

});
