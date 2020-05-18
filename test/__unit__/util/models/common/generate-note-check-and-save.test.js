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

describe('[util/models/common/generate-note-check-and-save]', () => {

    let validateFake;
    let userNoteSaveStub;

    it('Generated function should throw error if validate callback rejects', async () => {

        validateFake = sinon.fake.rejects();
        const checkAndSave = util.models.common.generateNoteCheckAndSave(validateFake).bind(userNote);

        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Generated function should throw error if noteDoc.save fails', async () => {

        validateFake = sinon.fake.resolves();
        userNoteSaveStub = sinon.stub(userNote, 'save').rejects();

        const checkAndSave = util.models.common.generateNoteCheckAndSave(validateFake).bind(userNote);
        await expect(checkAndSave()).to.eventually.be.rejectedWith(Error);

    });

    it('Generated function should return instance if all tasks resolve', async () => {

        validateFake = sinon.fake.resolves();
        userNoteSaveStub = sinon.stub(userNote, 'save').resolves(userNote);

        const checkAndSave = util.models.common.generateNoteCheckAndSave(validateFake).bind(userNote);
        await expect(checkAndSave()).to.eventually.eql(userNote);

    });

    afterEach(() => {
        sinon.restore();
    });

});
