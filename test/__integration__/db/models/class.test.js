const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const Class = require('../../../../src/db/models/class');

const { uniqueClassContext, baseClassContext } = require('../../../__fixtures__/models');
const { classAvatarContext } = require('../../../__fixtures__/models-storage');

const db = require('../../../__fixtures__/functions/db');
const dbStorage = require('../../../__fixtures__/functions/db-storage');

const { class: clazz } = require('../../../../src/db/names');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const getAssetBuffer = require('../../../__fixtures__/functions/assets/get-asset-buffer');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class] - uniqueClass context', () => {

    beforeEach(db.init(uniqueClassContext.persisted));

    const unpersistedClasses = uniqueClassContext.unpersisted[clazz.modelName];

    describe('[db/models/class] - Non unique user/title fields', () => {

        it('Should not persist if user/title fields for a class are not unique', async () => {

            const classDoc = unpersistedClasses[0];
            const clazz = new Class(classDoc);

            await expect(clazz.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

    });

    describe('[db/models/class] - Unique user/title fields', () => {

        it('Should persist if user/title fields for a class is unique', async () => {

            const classDoc = unpersistedClasses[1];
            const clazz = new Class(classDoc);

            await expect(clazz.save()).to.eventually.be.eql(clazz);

        });

    });

    afterEach(db.teardown(uniqueClassContext.persisted));

});

describe('[db/models/class] - baseClass context', () => {

    beforeEach(db.init(baseClassContext.persisted));

    const unpersistedClasses = baseClassContext.unpersisted[clazz.modelName];

    describe('[db/models/class] - methods.checkAndSave', () => {

        it('Should throw error if user is not found', async () => {

            const classDoc = unpersistedClasses[0];
            const clazz = new Class(classDoc);

            await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.teacherNotFound);

        });

        it('Should throw error if user exists but the account is disabled', async () => {

            const classDoc = unpersistedClasses[1];
            const clazz = new Class(classDoc);

            await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.teacherNotFound);

        });

        it('Should throw error if class owner is not a user with the teacher role assigned', async () => {

            const classDoc = unpersistedClasses[2];
            const clazz = new Class(classDoc);

            await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(Error, modelErrorMessages.notATeacher);

        });

        it('Should throw error if class to persist fails validation or unique index requirements', async () => {

            const classDoc = unpersistedClasses[3];
            const clazz = new Class(classDoc);

            await expect(clazz.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a valid class model to an enabled teacher', async () => {

            const classDoc = unpersistedClasses[4];
            const clazz = new Class(classDoc);

            await expect(clazz.checkAndSave()).to.eventually.be.eql(clazz);

        });

    });

    afterEach(db.teardown(baseClassContext.persisted));

});

describe('[db/models/class] - classAvatar context', function() {

    this.timeout(20000);

    this.beforeEach(dbStorage.init(classAvatarContext.persisted));

    const persistedClasses = classAvatarContext.persisted.db[clazz.modelName];
    const persistedClassAvatars = classAvatarContext.persisted.storage[clazz.modelName];

    const unpersistedClassAvatars = classAvatarContext.unpersisted.storage[clazz.modelName];

    describe('[db/models/class] - methods.saveAvatar', () => {

        it('Should throw error if it is attempted to save an invalid avatar', async () => {

            const documentFile = unpersistedClassAvatars[0];
            const buffer = getAssetBuffer(documentFile.originalname);

            const classTwoId = persistedClasses[1]._id;
            const classTwo = await Class.findOne({ _id: classTwoId });

            await expect(classTwo.saveAvatar(documentFile, buffer)).to.eventually.be.rejectedWith(MongooseError.ValidationError);

        });

        it('Should allow class with no avatar to save a new image', async () => {

            const pngImage = unpersistedClassAvatars[1];
            const buffer = getAssetBuffer(pngImage.originalname);

            const classTwoId = persistedClasses[1]._id;
            const classTwo = await Class.findOne({ _id: classTwoId });

            await expect(classTwo.saveAvatar(pngImage, buffer)).to.eventually.be.eql(classTwo);

            const res = await storageApi.getMultipartObject(bucketNames[clazz.modelName], classTwo.avatar.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.eql(classTwo.avatar.mimetype);

        });

        it('Should allow class with avatar to replace its avatar with another avatar', async () => {

            const pngImage = unpersistedClassAvatars[1];
            const buffer = getAssetBuffer(pngImage.originalname);

            const classOneId = persistedClasses[0]._id;
            const classOne = await Class.findOne({ _id: classOneId });

            await expect(classOne.saveAvatar(pngImage, buffer)).to.eventually.be.eql(classOne);

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[clazz.modelName]);

            const oldAvatarKeyname = persistedClassAvatars[0].keyname;

            expect(bucketKeys.length).to.equal(1);
            expect(bucketKeys).to.not.include(oldAvatarKeyname);

            const res = await storageApi.getMultipartObject(bucketNames[clazz.modelName], classOne.avatar.keyname);

            expect(res.buffer).to.eql(buffer);
            expect(res.contentType).to.eql(classOne.avatar.mimetype);

        });

    });

    describe('[db/models/class] - pre remove hook', () => {

        it('Should delete class avatar upon class removal', async () => {

            const classOneId = persistedClasses[0]._id;
            const classOne = await Class.findOne({ _id: classOneId });

            const classOneAvatarKeyname = classOne.avatar.keyname;

            await classOne.remove();

            const bucketKeys = await storageApi.listBucketKeys(bucketNames[clazz.modelName]);
            expect(bucketKeys).to.not.include(classOneAvatarKeyname);

        });

    });

    this.afterEach(dbStorage.teardown(classAvatarContext.persisted));

});
