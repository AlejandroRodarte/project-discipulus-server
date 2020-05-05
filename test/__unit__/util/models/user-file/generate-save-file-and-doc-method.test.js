const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { generateSaveFileAndDocMethod } = require('../../../../../src/util/models/user-file');
const { generateFakeFile, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { User, UserFile, ParentFile } = require('../../../../../src/db/models');

const names = require('../../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

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

beforeEach(() => {
    userFile = getNewModelInstance(UserFile, userFileDoc);
    parentFile = getNewModelInstance(ParentFile, parentFileDoc);
});

// describe('[util/models/user-file/generate-save-file-and-doc-method] - general testing', () => {

//     let userFindOneStub;

//     it('Returned function call should throw error if User.findOne (with correct args) returns null', async () => {

//         userFindOneStub = sinon.stub(User, 'findOne').resolves(null);

//         const saveFileAndDoc = generateSaveFileAndDocMethod()

//     });

//     afterEach(() => {
//         sinon.restore();
//     });

// });
