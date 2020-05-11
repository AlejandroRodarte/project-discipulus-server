const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const Class = require('../../../../src/db/models/class');

const { uniqueClassContext, baseClassContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const { user, class: clazz } = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/class] - uniqueClass context', () => {

    beforeEach(db.init(uniqueClassContext.persisted));

    const unpersistedClasses = uniqueClassContext.unpersisted[clazz.modelName];

    describe('[db/models/class] - Non unique user/title fields', () => {

        it('Should not persist if user/title fields for a class are not unique', async () => {

            const nonUniqueClassDoc = unpersistedClasses[0];
            const nonUniqueClass = new Class(nonUniqueClassDoc);

            await expect(nonUniqueClass.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

    });

    describe('[db/models/class] - Unique user/title fields', () => {

        it('Should persist if user/title fields for a class is unique', async () => {

            const uniqueClassDoc = unpersistedClasses[1];
            const uniqueClass = new Class(uniqueClassDoc);

            await expect(uniqueClass.save()).to.eventually.be.eql(uniqueClass);

        });

    });

    afterEach(db.teardown(uniqueClassContext.persisted));

});

describe('[db/models/class] - baseClass context', () => {

    beforeEach(db.init(baseClassContext.persisted));

    const unpersistedClasses = baseClassContext.unpersisted[clazz.modelName];

    describe('[db/models/class] - methods.checkAndSave', () => {

        it('Should throw error if user is not found', async () => {

            const unknownUserClassDoc = unpersistedClasses[0];
            const unknownUserClass = new Class(unknownUserClassDoc);

            await expect(unknownUserClass.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if user exists but the account is disabled', async () => {

            const disabledUserClassDoc = unpersistedClasses[1];
            const disabledUserClass = new Class(disabledUserClassDoc);

            await expect(disabledUserClass.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if class owner is not a user with the teacher role assigned', async () => {

            const notATeacherClassDoc = unpersistedClasses[2];
            const notATeacherClass = new Class(notATeacherClassDoc);

            await expect(notATeacherClass.checkAndSave()).to.eventually.be.rejectedWith(Error);

        });

        it('Should throw error if class to persist fails validation or unique index requirements', async () => {

            const invalidClassDoc = unpersistedClasses[3];
            const invalidClass = new Class(invalidClassDoc);

            await expect(invalidClass.checkAndSave()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist properly a valid class model to an enabled teacher', async () => {

            const validClassDoc = unpersistedClasses[4];
            const validClass = new Class(validClassDoc);

            await expect(validClass.checkAndSave()).to.eventually.be.eql(validClass);

        });

    });

    afterEach(db.teardown(baseClassContext.persisted));

});
