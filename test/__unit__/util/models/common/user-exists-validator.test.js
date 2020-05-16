const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { userExistsValidator } = require('../../../../../src/util/models/common');
const { generateFakeNote, getNewModelInstance } = require('../../../../__fixtures__/functions/models');

const { User, UserNote } = require('../../../../../src/db/models');

const expect = chai.expect;
chai.use(chaiAsPromised);

const { modelErrorMessages } = require('../../../../../src/util/errors');

const userNoteDoc = {
    user: new Types.ObjectId(),
    note: generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let userNote = new UserNote(userNoteDoc);

beforeEach(() => userNote = getNewModelInstance(UserNote, userNoteDoc));

describe('[util/models/common/user-exists-validator] - general flow', () => {

    let userExistsStub;

    it('Should throw error if User.exists (called with correct args) resolves to false', async () => {

        userExistsStub = sinon.stub(User, 'exists').resolves(false);
        await expect(userExistsValidator(userNote)).to.eventually.be.rejectedWith(Error, modelErrorMessages.userNotFoundOrDisabled);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userNote.user,
            enabled: true
        });

    });

    it('Should resolve if user does exist', async () => {
        userExistsStub = sinon.stub(User, 'exists').resolves(true);
        await expect(userExistsValidator(userNote)).to.eventually.be.fulfilled;
    });

    afterEach(() => {
        sinon.restore();
    });

});
