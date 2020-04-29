const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { TeacherFile } = require('../../../../src/db/models');

const { baseTeacherFileContext } = require('../../../__fixtures__/models');
const db = require('../../../__fixtures__/functions/db');

const { teacherFile } = require('../../../../src/db/names');

const baseTeacherFileContextModelNames = Object.keys(baseTeacherFileContext.persisted);

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/teacher-file] - baseTeacherFile context', () => {

    beforeEach(db.init(baseTeacherFileContext.persisted));

    describe('[db/models/teacher-file] - File keyname', () => {

        const persistedTeacherFiles = baseTeacherFileContext.persisted[teacherFile.modelName];
        const unpersistedTeacherFiles = baseTeacherFileContext.unpersisted[teacherFile.modelName]

        it('Should not persist a teacher-file which has a non-unique file keyname', async () => {

            const oldTeacherFile = await TeacherFile.findOne({ _id: persistedTeacherFiles[0]._id })
            const unpersistedTeacherFileDoc = unpersistedTeacherFiles[0];

            const newTeacherFile = new TeacherFile(unpersistedTeacherFileDoc);
            newTeacherFile.file.keyname = oldTeacherFile.file.keyname;

            await expect(newTeacherFile.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist a unique teacher-file', async () => {

            const unpersistedTeacherFileDoc = unpersistedTeacherFiles[0];
            const teacherFile = new TeacherFile(unpersistedTeacherFileDoc);

            await expect(teacherFile.save()).to.eventually.be.eql(teacherFile);

        });

    });

    afterEach(db.teardown(baseTeacherFileContextModelNames));

});
