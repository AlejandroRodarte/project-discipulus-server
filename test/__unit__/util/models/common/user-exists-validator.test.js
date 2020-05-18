const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../../src/db');
const util = require('../../../../../src/util');
const fixtures = require('../../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const userNoteDoc = {
    user: new Types.ObjectId(),
    note: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let userNote = new db.models.UserNote(userNoteDoc);

beforeEach(() => userNote = fixtures.functions.models.getNewModelInstance(db.models.UserNote, userNoteDoc));

describe('[util/models/common/user-exists-validator] - general flow', () => {

    let userExistsStub;

    it('Should throw error if User.exists (called with correct args) resolves to false', async () => {

        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(false);
        await expect(util.models.common.userExistsValidator(userNote)).to.eventually.be.rejectedWith(Error, util.errors.modelErrorMessages.userNotFoundOrDisabled);

        sinon.assert.calledOnceWithExactly(userExistsStub, {
            _id: userNote.user,
            enabled: true
        });

    });

    it('Should resolve if user does exist', async () => {
        userExistsStub = sinon.stub(db.models.User, 'exists').resolves(true);
        await expect(util.models.common.userExistsValidator(userNote)).to.eventually.be.fulfilled;
    });

    afterEach(() => {
        sinon.restore();
    });

});
