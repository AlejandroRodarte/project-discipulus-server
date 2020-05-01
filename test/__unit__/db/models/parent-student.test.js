const { Types } = require('mongoose');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { generateFakeUsers, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { User, ParentStudent } = require('../../../../src/db/models');

const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const parentStudentDoc = {
    parent: new Types.ObjectId(),
    student: new Types.ObjectId()
};

const [userDoc] = generateFakeUsers(1, {
    fakeToken: true
});

let parentStudent = new ParentStudent(parentStudentDoc);
let user = new User(userDoc);

beforeEach(() => {
    parentStudent = getNewModelInstance(ParentStudent, parentStudentDoc);
    user = getNewModelInstance(User, userDoc);
});

describe('[db/models/parent-student] - statics.add', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    let userFindOneStub;
    let userHasRoleStub;
    let userSaveStub;

    it('Should throw an error if parentStudentDoc has same ids', async () => {

        const sameIdParentStudentDoc = {
            parent: parentStudent.parent,
            student: parentStudent.parent
        };

        await expect(ParentStudent.add(sameIdParentStudentDoc)).to.eventually.be.rejectedWith(Error);

    });

    it('Should call User.findOne with correct args and throw error when resolves null user', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(null);
        
        await expect(ParentStudent.add(parentStudentDoc)).to.eventually.be.rejectedWith(Error);
    
        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: parentStudent.parent,
            enabled: true
        });

    });

    it('Should call parent.hasRole with correct args and throw error when resolves to false', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(false);

        await expect(ParentStudent.add(parentStudentDoc)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, roleTypes.ROLE_PARENT);

    });

    it('Should throw error on save if ParentStudent model validation rules fail', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(true);
        userSaveStub = sandbox.stub(ParentStudent.prototype, 'save').rejects();

        await expect(ParentStudent.add(parentStudentDoc)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(userSaveStub);

    });

    it('Should return parentStudent instance model when validations pass', async () => {

        userFindOneStub = sandbox.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sandbox.stub(user, 'hasRole').resolves(true);
        userSaveStub = sandbox.stub(ParentStudent.prototype, 'save').resolves();

        await expect(ParentStudent.add(parentStudentDoc)).to.eventually.be.instanceof(ParentStudent);

    });

    afterEach(() => {
        sandbox.restore();
    });

});
