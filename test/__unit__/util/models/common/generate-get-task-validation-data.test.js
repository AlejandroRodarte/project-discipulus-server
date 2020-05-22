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

const [homeworkStudentFileDoc] = fixtures.functions.util.generateOneToMany('homeworkStudent', new Types.ObjectId(), [{ file: fixtures.functions.models.generateFakeFile() }]);
let homeworkStudentFile = new db.models.HomeworkStudentFile(homeworkStudentFileDoc);

const args = {
    child: {
        collectionName: shared.db.names.homeworkStudent.collectionName,
        ref: 'homeworkStudent'
    },
    grandChildOne: {
        collectionName: shared.db.names.classStudent.collectionName,
        ref: 'classStudent',
        forcedFlagRef: 'forceHomeworkUpload'
    },
    grandChildTwo: {
        collectionName: shared.db.names.homework.collectionName,
        ref: 'homework'
    }
};

beforeEach(() => homeworkStudentFile = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudentFile, homeworkStudentFileDoc));

describe('[util/models/common/generate-get-task-validation-data] - general flow', () => {

    let homeworkStudentFileAggregateStub;

    it('Should throw error if Model.aggregate resolves to an empty array', async () => {

        homeworkStudentFileAggregateStub = sinon.stub(db.models.HomeworkStudentFile, 'aggregate').resolves([]);
        const getTaskValidationData = util.models.common.generateGetTaskValidationData(args).bind(homeworkStudentFile);

        await expect(getTaskValidationData()).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.taskValidationDataNotFound);

        sinon.assert.calledOnceWithExactly(homeworkStudentFileAggregateStub, shared.db.aggregation.sharedPipelines.getTaskValidationData(homeworkStudentFile._id, args));

    });

    it('Should return validation data if aggregation resolves', async () => {

        const validationData = {
            _id: new Types.ObjectId(),
            completed: false,
            forced: false,
            end: 150
        };

        homeworkStudentFileAggregateStub = sinon.stub(db.models.HomeworkStudentFile, 'aggregate').resolves([validationData]);

        const getTaskValidationData = util.models.common.generateGetTaskValidationData(args).bind(homeworkStudentFile);
        await expect(getTaskValidationData()).to.eventually.eql(validationData);


    });

    afterEach(() => {
        sinon.restore();
    });

});
