const { Types } = require('mongoose');
const moment = require('moment');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const util = require('../../../../../src/util');
const shared = require('../../../../../src/shared');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [homeworkStudentFileDoc] = fixtures.functions.util.generateOneToMany('homeworkStudent', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let homeworkStudentFile = new db.models.HomeworkStudentFile(homeworkStudentFileDoc);

const args = {
    alreadyCompleteErrorMessage: util.errors.modelErrorMessages.homeworkAlreadyComplete,
    expiredErrorMessage: util.errors.modelErrorMessages.homeworkExpired,
    notAvailableErrorMessage: util.errors.modelErrorMessages.homeworkNotPublished
};

beforeEach(() => homeworkStudentFile = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudentFile, homeworkStudentFileDoc));

describe('[util/models/common/generate-task-validator] - general flow', () => {

    let homeworkStudentFileGetTaskValidationDataStub;

    it('Should throw error if docs.getTaskValidationData rejects', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').rejects();
        const validator = util.models.common.generateTaskValidator(args);

        await expect(validator(homeworkStudentFile)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(homeworkStudentFileGetTaskValidationDataStub);

    });

    it('Should throw error if validation data informs the task is already complete', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: true,
            forced: false,
            end: 0,
            published: true
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.rejectedWith(Error, args.alreadyCompleteErrorMessage);

    });

    it('Should throw error if validation data informs the task is currently not published', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: false,
            forced: false,
            end: null,
            published: false
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.rejectedWith(Error, args.notAvailableErrorMessage);

    });

    it('Should throw error if validation data informs the task can not be forced to be uploaded and it already expired', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: false,
            forced: false,
            end: moment().subtract(1, 'day').utc().unix(),
            published: true
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.rejectedWith(Error, args.expiredErrorMessage);

    });

    it('Should validate if task can be forced to be uploaded', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: false,
            forced: true,
            end: moment().subtract(1, 'day').utc().unix(),
            published: true
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.fulfilled;

    });

    it('Should validate if task does not have a due date', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: false,
            forced: false,
            end: null,
            published: true
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.fulfilled;

    });

    it('Should validate if task due date still has not expired', async () => {

        homeworkStudentFileGetTaskValidationDataStub = sinon.stub(homeworkStudentFile, 'getTaskValidationData').resolves({
            _id: new Types.ObjectId(),
            completed: false,
            forced: false,
            end: moment().add(1, 'day').utc().unix(),
            published: true
        });

        const validator = util.models.common.generateTaskValidator(args);
        await expect(validator(homeworkStudentFile)).to.eventually.be.fulfilled;

    });

    afterEach(() => {
        sinon.restore();
    });

});
