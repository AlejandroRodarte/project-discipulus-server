const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { StudentFile } = require('../../../../src/db/models');

const { baseStudentFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { studentFile } = require('../../../../src/db/names');

const baseStudentFileContextNames = Object.keys(baseStudentFileContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/student-file] - baseStudentFile context', () => {

    beforeEach(db.init(baseStudentFileContext.persisted));

    describe('[db/models/student-file] - File keyname', () => {

        const persistedStudentFiles = baseStudentFileContext.persisted[studentFile.modelName];
        const unpersistedStudentFiles = baseStudentFileContext.unpersisted[studentFile.modelName]

        it('Should not persist a student-file which has a non-unique file keyname', async () => {

            const oldStudentFile = await StudentFile.findOne({ _id: persistedStudentFiles[0]._id })
            const unpersistedStudentFileDoc = unpersistedStudentFiles[0];

            const newStudentFile = new StudentFile(unpersistedStudentFileDoc);
            newStudentFile.file.keyname = oldStudentFile.file.keyname;

            await expect(newStudentFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist a unique student-file', async () => {

            const unpersistedStudentFileDoc = unpersistedStudentFiles[0];
            const studentFile = new StudentFile(unpersistedStudentFileDoc);

            await expect(studentFile.save()).to.eventually.be.eql(studentFile);

        });

    });

    afterEach(db.teardown(baseStudentFileContextNames));

});
