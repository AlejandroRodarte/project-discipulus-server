const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { mongo } = require('mongoose');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[db/models/user-event] - uniqueUserEvent context', () => {

    beforeEach(fixtures.functions.db.init(fixtures.models.uniqueUserEventContext.persisted));
    
    const unpersistedUserEvents = fixtures.models.uniqueUserEventContext.unpersisted[shared.db.names.userEvent.modelName];

    describe('[db/models/user-event] - user/title index', () => {

        it('Should not persist if user/title index is not unique', async () => {

            const userEventDoc = unpersistedUserEvents[0];
            const userEvent = new db.models.UserEvent(userEventDoc);

            await expect(userEvent.save()).to.eventually.be.rejectedWith(mongo.MongoError);

        });

        it('Should persist if user/title index is unique', async () => {

            const userEventDoc = unpersistedUserEvents[1];
            const userEvent = new db.models.UserEvent(userEventDoc);

            await expect(userEvent.save()).to.eventually.eql(userEvent);

        });


    });

    afterEach(fixtures.functions.db.teardown(fixtures.models.uniqueUserEventContext.persisted));

});
