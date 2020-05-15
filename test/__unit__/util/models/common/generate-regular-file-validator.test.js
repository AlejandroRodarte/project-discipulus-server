const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateRegularFileValidator } = require('../../../../../src/util/models/common');
const { generateFakeFile, getNewModelInstance, generateFakeClass } = require('../../../../__fixtures__/functions/models');

const { Class, ClassFile } = require('../../../../../src/db/models');

const names = require('../../../../../src/db/names');

const { modelErrorMessages } = require('../../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classDoc = {
    _id: new Types.ObjectId(),
    user: new Types.ObjectId(),
    ...generateFakeClass({
        titleWords: 5,
        descriptionWords: 10,
        sessions: [[0, 10]]
    })
};

const classFileDoc = {
    class: classDoc._id,
    file: generateFakeFile()
};

let classFile = new ClassFile(classFileDoc);

beforeEach(() => {
    clazz = getNewModelInstance(Class, classDoc);
    classFile = getNewModelInstance(ClassFile, classFileDoc);
});

describe('[util/models/common/generate-regular-file-validator] - general flow', () => {

    let classExistsStub;

    it('Returned function should throw error if ParentModel.exists (called with correct args) resolves to false', async () => {

        classExistsStub = sinon.stub(Class, 'exists').resolves(false);

        const validatorFn = generateRegularFileValidator({
            parentModelName: names.class.modelName,
            ref: 'class',
            notFoundErrorMessage: modelErrorMessages.classNotFound
        });

        await expect(validatorFn(classFile)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(classExistsStub, {
            _id: classFile.class
        });

    });

    it('Returned function should resolve if tasks resolve', async () => {

        classExistsStub = sinon.stub(Class, 'exists').resolves(true);

        const validatorFn = generateRegularFileValidator({
            parentModelName: names.class.modelName,
            ref: 'class',
            notFoundErrorMessage: modelErrorMessages.classNotFound
        });

        await expect(validatorFn(classFile)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
