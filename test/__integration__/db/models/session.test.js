const chai = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
const { mongo, Error: MongooseError } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/session] - uniqueSession context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueSessionContext.persisted));

    const unpersistedSessions = fixtures.models.uniqueSessionContext.unpersisted[shared.db.names.session.modelName];

    describe('[db/models/session] - class/title unique index', () => {

        it('Should not persist if class/title index is not unique', async () => {

            const sessionDoc = unpersistedSessions[0];
            const session = new db.models.Session(sessionDoc);

            await expect(session.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist if class/title index is unique', async () => {

            const sessionDoc = unpersistedSessions[1];
            const session = new db.models.Session(sessionDoc);

            await expect(session.save()).to.eventually.eql(session);

        });

    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueSessionContext.persisted));

});
