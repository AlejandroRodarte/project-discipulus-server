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

const classDoc = {
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),
    ...fixtures.functions.models.generateFakeClass({
        titleWords: 5,
        descriptionWords: 10,
        sessions: [[0, 10]]
    })
};

const classFileDoc = {
    class: classDoc._id,
    file: fixtures.functions.models.generateFakeFile()
};

let classFile = new db.models.ClassFile(classFileDoc);

beforeEach(() => {
    clazz = fixtures.functions.models.getNewModelInstance(db.models.Class, classDoc);
    classFile = fixtures.functions.models.getNewModelInstance(db.models.ClassFile, classFileDoc);
});

describe('[util/models/common/generate-parent-doc-exists-validator] - general flow', () => {

    let classExistsStub;

    it('Returned function should throw error if ParentModel.exists (called with correct args) resolves to false', async () => {

        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(false);

        const validatorFn = util.models.common.generateParentDocExistsValidator({
            parentModelName: shared.db.names.class.modelName,
            ref: 'class',
            notFoundErrorMessage: util.errors.modelErrorMessages.classNotFound
        });

        await expect(validatorFn(classFile)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classFile.class
        });

    });

    it('Returned function should resolve if tasks resolve', async () => {

        classExistsStub = sinon.stub(db.models.Class, 'exists').resolves(true);

        const validatorFn = util.models.common.generateParentDocExistsValidator({
            parentModelName: shared.db.names.class.modelName,
            ref: 'class',
            notFoundErrorMessage: util.errors.modelErrorMessages.classNotFound
        });

        await expect(validatorFn(classFile)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
