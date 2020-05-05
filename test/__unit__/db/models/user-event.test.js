const expect = require('chai').expect;

const { Types } = require('mongoose');
const lorem = require('../../../__fixtures__/util/lorem');

const { userEventDefinition } = require('../../../../src/db/schemas/user-event');
const { testForInvalidModel, testForValidModel, getNewModelInstance, generateFakeEvent } = require('../../../__fixtures__/functions/models');

const { UserEvent } = require('../../../../src/db/models');

const userEventDoc = {
    user: new Types.ObjectId(),
    ...generateFakeEvent({
        titleWords: 3,
        descriptionWords: 15,
        start: 100,
        end: 1000,
        before: 80
    })
};

let userEvent = new UserEvent(userEventDoc);

beforeEach(() => userEvent = getNewModelInstance(UserEvent, userEventDoc));

describe('[db/models/user-event] - Invalid user', () => {

    it('Should not validate if user _id is undefined', () => {
        userEvent.user = undefined;
        testForInvalidModel(userEvent, userEventDefinition.user.required);
    });

});

describe('[db/models/user-event] - Invalid title', () => {

    const [titleMinLength] = userEventDefinition.title.minlength;
    const [titleMaxLength] = userEventDefinition.title.maxlength;

    it('Should not validate if title is undefined', () => {
        userEvent.title = undefined;
        testForInvalidModel(userEvent, userEventDefinition.title.required);
    });

    it(`Should not validate if title is shorter than ${ titleMinLength } characters`, () => {
        userEvent.title = 'do';
        testForInvalidModel(userEvent, userEventDefinition.title.minlength);
    });

    it(`Should not validate if title is longer than ${ titleMaxLength } characters`, () => {
        userEvent.title = lorem.generateWords(30);
        testForInvalidModel(userEvent, userEventDefinition.title.maxlength);
    });

});

describe('[db/models/user-event] - Invalid title', () => {

    it('Should trim event title redundant spaces', () => {
        userEvent.title = '  my  super     event ';
        testForValidModel(userEvent);
        expect(userEvent.title).to.equal('my super event');
    });

});

describe('[db/models/user-event] - Undefined description', () => {

    it('Should validate description if event description is undefined', () => {
        userEvent.description = undefined;
        testForValidModel(userEvent);
    });

});

describe('[db/models/user-event] - Invalid description', () => {

    const [descriptionMaxLength] = userEventDefinition.description.maxlength;

    it(`Should not validate description if its longer than ${ descriptionMaxLength } characters`, () => {
        userEvent.description = lorem.generateWords(60);
        testForInvalidModel(userEvent, userEventDefinition.description.maxlength);
    });

});

describe('[db/models/user-event] - Valid description', () => {

    it('Should trim event description redundant spaces', () => {
        userEvent.description = '   who     wrote      this   ';
        testForValidModel(userEvent);
        expect(userEvent.description).to.equal('who wrote this');
    });

});

describe('[db/models/user-event] - Invalid timerange', () => {

    it('Should not validate event with an undefined timerange', () => {
        userEvent.timerange = undefined;
        testForInvalidModel(userEvent, userEventDefinition.timerange.required);
    });

});

describe('[db/models/user-event] - Invalid before notification time', () => {

    const [beforeMin] = userEventDefinition.before.min;

    it('Should not validate if before notification time is undefined', () => {
        userEvent.before = undefined;
        testForInvalidModel(userEvent, userEventDefinition.before.required);
    });

    it(`Should not validate if before if its smaller than ${ beforeMin } seconds`, () => {
        userEvent.before = 40;
        testForInvalidModel(userEvent, userEventDefinition.before.min);
    });

});
