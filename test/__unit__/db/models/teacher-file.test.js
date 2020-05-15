const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { User, TeacherFile } = require('../../../../src/db/models');

const modelFunctions = require('../../../__fixtures__/functions/models');

const names = require('../../../../src/db/names');
const roleTypes = require('../../../../src/util/roles');

const storageApi = require('../../../../src/api/storage');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const { modelErrorMessages } = require('../../../../src/util/errors');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = modelFunctions.generateFakeUsers(1, { fakeToken: true });

const teacherFileDoc = {
    user: userDoc._id,
    file: modelFunctions.generateFakeFile()
};

let user = new User(userDoc);
let teacherFile = new TeacherFile(teacherFileDoc);

beforeEach(() => {
    user = modelFunctions.getNewModelInstance(User, userDoc);
    teacherFile = modelFunctions.getNewModelInstance(TeacherFile, teacherFileDoc);
});

describe('[db/models/teacher-file] - methods.saveFileAndDoc', () => {

    let userFindByIdAndValidateRoleStub;
    let teacherFileSaveStub;
    let createMultipartObjectStub;

    const buffer = Buffer.alloc(10);

    it('Generated functions should be called with the correct arguments, resolving the persisted teacher file', async () => {

        userFindByIdAndValidateRoleStub = sinon.stub(User, 'findByIdAndValidateRole').resolves(user);
        teacherFileSaveStub = sinon.stub(teacherFile, 'save').resolves(teacherFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        await expect(teacherFile.saveFileAndDoc(buffer)).to.eventually.eql(teacherFile);

        sinon.assert.calledOnceWithExactly(userFindByIdAndValidateRoleStub, teacherFile.user, roleTypes.ROLE_TEACHER, {
            notFoundErrorMessage: modelErrorMessages.userNotFoundOrDisabled,
            invalidRoleErrorMessage: modelErrorMessages.fileStorePermissionDenied
        });

        sinon.assert.calledOnce(teacherFileSaveStub);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.teacherFile.modelName], {
            keyname: teacherFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: teacherFile.file.mimetype
        });

    });

    afterEach(() => {
        sinon.restore();
    });

});
