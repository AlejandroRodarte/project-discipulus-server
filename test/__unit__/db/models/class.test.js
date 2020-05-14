const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const lorem = require('../../../__fixtures__/util/lorem');

const { classDefinition } = require('../../../../src/db/schemas/class');
const { testForInvalidModel, testForValidModel, getNewModelInstance, generateFakeClass, generateFakeUsers } = require('../../../__fixtures__/functions/models');

const { User, Class } = require('../../../../src/db/models');

const sampleFiles = require('../../../__fixtures__/shared/sample-files');
const roleTypes = require('../../../../src/util/roles');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const names = require('../../../../src/db/names');

const regexp = require('../../../../src/util/regexp');

const { modelErrorMessages } = require('../../../../src/util/errors');

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

describe('[db/models/class] - statics.findByIdAndCheckForSelfAssociation', () => {

    let classFindOneStub;
    
    const ids = {
        classId: clazz._id,
        studentId: new Types.ObjectId()
    };

    it('Should throw error if Class.findOne (called with right args) resolves null', async () => {

        classFindOneStub = sinon.stub(Class, 'findOne').resolves(null);
        await expect(Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.be.rejectedWith(Error, modelErrorMessages.classNotFound);

        sinon.assert.calledOnceWithExactly(classFindOneStub, {
            _id: ids.classId
        });

    });

    it('Should throw error if class.user equals studentId (self-association)', async () => {

        clazz.user = ids.studentId;

        classFindOneStub = sinon.stub(Class, 'findOne').resolves(clazz);
        await expect(Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.be.rejectedWith(Error, modelErrorMessages.selfTeaching);

    });

    it('Should return class instance if all checks pass', async () => {
        classFindOneStub = sinon.stub(Class, 'findOne').resolves(clazz);
        await expect(Class.findByIdAndCheckForSelfAssociation(ids)).to.eventually.eql(clazz);
    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class] - methods.checkAndSave', () => {

    let userFindByIdAndValidateRoleStub;
    let classSaveStub;

    it('Should throw error if User.findByIdAndValidateRole (called with correct args) throws', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').rejects();
        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, clazz.user, roleTypes.ROLE_TEACHER, {
            notFoundErrorMessage: modelErrorMessages.teacherNotFound,
            invalidRoleErrorMessage: modelErrorMessages.notATeacher
        });

    });

    it('Should throw error if class.save happens to fail', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);
        classSaveStub = sinon.stub(clazz, 'save').rejects();

        await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classSaveStub);

    });

    it('Should return class model instance if all promises resolve properly', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);

        await expect(clazz.checkAndSave()).to.eventually.be.eql(clazz);

    });

    afterEach(() => {
        sinon.restore();
    });

});

describe('[db/models/class] - methods.saveAvatar', () => {

    let deleteBucketObjectsStub;
    let classSaveStub;
    let createMultipartObjectStub;

    const pngImage = sampleFiles.pngImage;
    const buffer = Buffer.alloc(10);

    it('Should throw error if class avatar is defined but storageApi.deleteBucketObjects (called with correct args) fails', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').rejects();
        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteBucketObjectsStub, bucketNames[names.class.modelName], [clazz.avatar.keyname]);

    });

    it('Should throw error if class.save fails', async () => {

        clazz.avatar = undefined;
        classSaveStub = sinon.stub(clazz, 'save').rejects();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(classSaveStub);

    });

    it('Should throw error if storageApi.createMultipartObject (called with correct args) fails; class avatar should be undefined', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').resolves();
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.be.rejectedWith(Error);

        expect(clazz.avatar).to.be.undefined;

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.class.modelName], {
            keyname: sinon.match(regexp.fileKeyname),
            buffer,
            size: buffer.length,
            mimetype: pngImage.mimetype
        });

        sinon.assert.calledTwice(classSaveStub);

    });

    it('Should return class model instance if all required promises resolve properly', async () => {

        deleteBucketObjectsStub = sinon.stub(storageApi, 'deleteBucketObjects').resolves();
        classSaveStub = sinon.stub(clazz, 'save').resolves(clazz);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(clazz.saveAvatar(pngImage, buffer)).to.eventually.eql(clazz);

    });

    afterEach(() => {
        sinon.restore();
    });

});
