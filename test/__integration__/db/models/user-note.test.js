const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const { UserNote } = require('../../../../src/db/models');

const { uniqueUserNoteContext } = require('../../../__fixtures__/models');

const db = require('../../../__fixtures__/functions/db');

const names = require('../../../../src/db/names');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-note] - uniqueUserNote context', () => {

    beforeEach(db.init(uniqueUserNoteContext.persisted));

    describe('[db/models/user-note] - user/file.originalname index', () => {

        const unpersistedUserNotes = uniqueUserNoteContext.unpersisted[names.userNote.modelName];

        it('Should fail on duplicate user/file.originalname index', async () => {
            const userNote = new UserNote(unpersistedUserNotes[0]);
            await expect(userNote.save()).to.eventually.be.rejectedWith(mongo.MongoError);
        });

        it('Should persist on unique user/file.originalname index', async () => {
            const userNote = new UserNote(unpersistedUserNotes[1]);
            await expect(userNote.save()).to.eventually.be.eql(userNote);
        });

    });

    afterEach(db.teardown(uniqueUserNoteContext.persisted));

});
