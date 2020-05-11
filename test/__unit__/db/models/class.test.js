const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { Types } = require('mongoose');
const lorem = require('../../../__fixtures__/util/lorem');

const { classDefinition } = require('../../../../src/db/schemas/class');
const { testForInvalidModel, testForValidModel, getNewModelInstance, generateFakeClass, generateFakeUsers } = require('../../../__fixtures__/functions/models');

const { User, Class } = require('../../../../src/db/models');

const sampleFiles = require('../../../__fixtures__/shared/sample-files');
const roleTypes = require('../../../../src/util/roles');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, { fakeToken: true });

const classDoc = {
    user: userDoc._id,
    ...generateFakeClass({
        titleWords: 5,
        descriptionWords: 20,
        sessions: [[0, 20], [30, 40], [70, 90]]
    })
};

let clazz = new Class(classDoc);
let user = new User(userDoc);

beforeEach(() => {
    clazz = getNewModelInstance(Class, classDoc);
    user = getNewModelInstance(User, userDoc);
});

describe('[db/models/class] - Invalid user', () => {

    it('Should not validate if user _id is not defined', () => {
        clazz.user = undefined;
        testForInvalidModel(clazz, classDefinition.user.required);
    });

});

describe('[db/models/class] - Invalid title', () => {

    const [titleMinLength] = classDefinition.title.minlength;
    const [titleMaxLength] = classDefinition.title.maxlength;

    it(`Should not validate if title is shorter than ${ titleMinLength } characters`, () => {
        clazz.title = 'bo';
        testForInvalidModel(clazz, classDefinition.title.minlength);
    });

    it(`Should not validate if title is longer than ${ titleMaxLength } characters`, () => {
        clazz.title = lorem.generateWords(100);
        testForInvalidModel(clazz, classDefinition.title.maxlength);
    });

});

describe('[db/models/class] - Valid title', () => {

    it('Should remove redundant spaces on valid class title', () => {
        clazz.title = '     superhard  class yo  ';
        testForValidModel(clazz);
        expect(clazz.title).to.equal('superhard class yo');
    });

});

describe('[db/models/class] - Undefined description', () => {

    it('Should validate if class description is undefined', () => {
        clazz.description = undefined;
        testForValidModel(clazz);
    })

});

describe('[db/models/class] - Invalid description', () => {

    const [descriptionMaxLength] = classDefinition.description.maxlength;

    it(`Should not validate class description longer than ${ descriptionMaxLength } characters`, () => {
        clazz.description = lorem.generateWords(250);
        testForInvalidModel(clazz, classDefinition.description.maxlength);
    });

});

describe('[db/models/class] - Valid description', () => {

    it('Should remove redundant spaces on valid class descriptions', () => {
        clazz.description = '    lmao    who wrote   this  ';
        testForValidModel(clazz);
        expect(clazz.description).to.equal('lmao who wrote this');
    });

});

describe('[db/models/class] - Undefined avatar', () => {

    it('Should validate class if avatar is undefined', () => {
        clazz.avatar = undefined;
        testForValidModel(clazz);
    });

});

describe('[db/models/class] - Invalid avatar', () => {

    it('Should not validate avatar that is not an image', () => {
        clazz.avatar = sampleFiles.documentFile;
        testForInvalidModel(clazz, classDefinition.avatar.validate);
    });

});

describe('[db/models/class] - Invalid sessions', () => {

    it('Should not validate a class that has no sessions', () => {
        clazz.sessions = [];
        testForInvalidModel(clazz, classDefinition.sessions.validate);
    });

    it('Should not validate sessions that are not incremental', () => {

        clazz.sessions = [
            {
                start: 30,
                end: 50
            },
            {
                start: 70,
                end: 90
            },
            {
                start: 85,
                end: 100
            }
        ];

        testForInvalidModel(clazz, classDefinition.sessions.validate);

    });
    
});

describe('[db/models/class] - Default archive', () => {

    it('Should default to false if archive flag is not specified', () => {
        expect(clazz.archive).to.equal(false);
    });

});

describe('[db/models/class] - Valid class', () => {

    it('Should validate a class that meets all validation requirements', () => {
        testForValidModel(clazz);
    });

});

describe('[db/models/class] - methods.checkAndSave', () => {

    let userFindOneStub;
    let userHasRoleStub;
    let classSaveStub;

    it('Should throw error if User.findOne (called with correct args) resolved to null', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);
        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: clazz.user,
            enabled: true
        });

    });

    it('Should throw error if user.hasRole resolved to false', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(false);

        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, roleTypes.ROLE_TEACHER);

    });

    it('Should throw error if class.save happens to fail', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        classSaveStub = sinon.stub(clazz, 'save').rejects();

        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classSaveStub);

    });

    it('Should return class model instance if all promises resolve properly', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);

        await expect(clazz.checkAndSave()).to.eventually.be.eql(clazz);

    });

    afterEach(() => {
        sinon.restore();
    });

});
