const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const Class = require('../../../../src/db/models/class');

const { uniqueClassContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const { class: clazz } = require('../../../../src/db/names');

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
