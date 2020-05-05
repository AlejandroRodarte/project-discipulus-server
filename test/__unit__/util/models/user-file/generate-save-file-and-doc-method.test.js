const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateSaveFileAndDocMethod } = require('../../../../../src/util/models/user-file');
const { generateFakeFile, getNewModelInstance, generateFakeUsers } = require('../../../../__fixtures__/functions/models');

const { User, UserFile, ParentFile } = require('../../../../../src/db/models');

const names = require('../../../../../src/db/names');
const roleTypes = require('../../../../../src/util/roles');

const storageApi = require('../../../../../src/api/storage');
const bucketNames = require('../../../../../src/api/storage/config/bucket-names');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [userDoc] = generateFakeUsers(1, {
    fakeToken: true
});

const userFileDoc = {
    user: new Types.ObjectId(),
    file: generateFakeFile()
};

const parentFileDoc = {
    user: new Types.ObjectId(),
    file: generateFakeFile()
};

let userFile = new UserFile(userFileDoc);
let parentFile = new ParentFile(parentFileDoc);
let user = new User(userDoc);

beforeEach(() => {
    userFile = getNewModelInstance(UserFile, userFileDoc);
    parentFile = getNewModelInstance(ParentFile, parentFileDoc);
    user = getNewModelInstance(User, userDoc);
});

describe('[util/models/user-file/generate-save-file-and-doc-method] - general testing', () => {

    let userFindOneStub;
    let userHasRoleStub;
    let fileDocSaveStub;
    let createMultipartObjectStub;
    let fileDocRemoveStub;

    it('Returned function call should throw error if User.findOne (with correct args) returns null', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(null);

        const saveFileAndDoc = generateSaveFileAndDocMethod({
            modelName: names.userFile.modelName,
            roleOpts: {
                check: false,
                role: null
            }
        }).bind(userFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userFindOneStub, {
            _id: userFile.user,
            enabled: true
        });

    });

    it('Returned function call should throw error if role-check test fails. user.hasRole is called with correct args', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(false);

        const saveFileAndDoc = generateSaveFileAndDocMethod({
            modelName: names.parentFile.modelName,
            roleOpts: {
                check: true,
                role: roleTypes.ROLE_PARENT
            }
        }).bind(parentFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(userHasRoleStub, roleTypes.ROLE_PARENT);

    });

    it('Returned function should throw error if .save() call fails', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        fileDocSaveStub = sinon.stub(parentFile, 'save').rejects();

        const saveFileAndDoc = generateSaveFileAndDocMethod({
            modelName: names.parentFile.modelName,
            roleOpts: {
                check: true,
                role: roleTypes.ROLE_PARENT
            }
        }).bind(parentFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnce(fileDocSaveStub);

    });

    it('Returned function should throw error and call fileDoc.remove if storageApi.createMultipartObject happends to fail (called with correct args)', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        fileDocSaveStub = sinon.stub(userFile, 'save').resolves(userFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').rejects();
        fileDocRemoveStub = sinon.stub(userFile, 'remove').resolves();

        const saveFileAndDoc = generateSaveFileAndDocMethod({
            modelName: names.userFile.modelName,
            roleOpts: {
                check: false,
                role: null
            }
        }).bind(userFile);

        const buffer = Buffer.alloc(10);

        await expect(saveFileAndDoc(buffer)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartObjectStub, bucketNames[names.userFile.modelName], {
            keyname: userFile.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: userFile.file.mimetype
        });

        sinon.assert.calledOnce(fileDocRemoveStub);

    });

    it('Returned function should return fileDoc if all promises succeed', async () => {

        userFindOneStub = sinon.stub(User, 'findOne').resolves(user);
        userHasRoleStub = sinon.stub(user, 'hasRole').resolves(true);
        fileDocSaveStub = sinon.stub(parentFile, 'save').resolves(parentFile);
        createMultipartObjectStub = sinon.stub(storageApi, 'createMultipartObject').resolves();

        const saveFileAndDoc = generateSaveFileAndDocMethod({
            modelName: names.parentFile.modelName,
            roleOpts: {
                check: true,
                role: roleTypes.ROLE_PARENT
            }
        }).bind(parentFile);

        await expect(saveFileAndDoc(Buffer.alloc(10))).to.eventually.be.eql(parentFile);

    });

    afterEach(() => {
        sinon.restore();
    });

});
