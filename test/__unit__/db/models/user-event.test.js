const expect = require('chai').expect;

const { Types } = require('mongoose');
const lorem = require('../../../__fixtures__/util/lorem');

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const userEventDoc = {
    user: new Types.ObjectId(),
    ...fixtures.functions.models.generateFakeEvent({
        titleWords: 3,
        descriptionWords: 15,
        start: 100,
        end: 1000,
        before: 80
    })
};

let userEvent = new db.models.UserEvent(userEventDoc);

beforeEach(() => userEvent = fixtures.functions.models.getNewModelInstance(db.models.UserEvent, userEventDoc));

describe('[db/models/user-event] - Invalid user', () => {

    it('Should not validate if user _id is undefined', () => {
        userEvent.user = undefined;
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.user.required);
    });

});

describe('[db/models/user-event] - Invalid title', () => {

    const [titleMinLength] = db.schemas.definitions.userEventDefinition.title.minlength;
    const [titleMaxLength] = db.schemas.definitions.userEventDefinition.title.maxlength;

    it('Should not validate if title is undefined', () => {
        userEvent.title = undefined;
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.title.required);
    });

    it('Should not validate if title has bad words', () => {
        userEvent.title = 'Fuck bitches';
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.title.validate);
    });

    it(`Should not validate if title is shorter than ${ titleMinLength } characters`, () => {
        userEvent.title = 'do';
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.title.minlength);
    });

    it(`Should not validate if title is longer than ${ titleMaxLength } characters`, () => {
        userEvent.title = lorem.generateWords(30);
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.title.maxlength);
    });

});

describe('[db/models/user-event] - Valid title', () => {

    it('Should trim event title redundant spaces', () => {
        userEvent.title = '  my  super     event ';
        fixtures.functions.models.testForValidModel(userEvent);
        expect(userEvent.title).to.equal('my super event');
    });

});

describe('[db/models/user-event] - Undefined description', () => {

    it('Should validate description if event description is undefined', () => {
        userEvent.description = undefined;
        fixtures.functions.models.testForValidModel(userEvent);
    });

});

describe('[db/models/user-event] - Invalid description', () => {

    const [descriptionMaxLength] = db.schemas.definitions.userEventDefinition.description.maxlength;

    it('Should not validate if description has bad words', () => {
        userEvent.description = 'Homies to bang a whore';
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.description.validate);
    });

    it(`Should not validate description if its longer than ${ descriptionMaxLength } characters`, () => {
        userEvent.description = lorem.generateWords(60);
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.description.maxlength);
    });

});

describe('[db/models/user-event] - Valid description', () => {

    it('Should trim event description redundant spaces', () => {
        userEvent.description = '   who     wrote      this   ';
        fixtures.functions.models.testForValidModel(userEvent);
        expect(userEvent.description).to.equal('who wrote this');
    });

});

describe('[db/models/user-event] - Invalid timerange', () => {

    it('Should not validate event with an undefined timerange', () => {
        userEvent.timerange = undefined;
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.timerange.required);
    });

});

describe('[db/models/user-event] - Invalid before notification time', () => {

    const [beforeMin] = db.schemas.definitions.userEventDefinition.before.min;

    it('Should not validate if before notification time is undefined', () => {
        userEvent.before = undefined;
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.before.required);
    });

    it(`Should not validate if before if its smaller than ${ beforeMin } seconds`, () => {
        userEvent.before = 40;
        fixtures.functions.models.testForInvalidModel(userEvent, db.schemas.definitions.userEventDefinition.before.min);
    });

});
