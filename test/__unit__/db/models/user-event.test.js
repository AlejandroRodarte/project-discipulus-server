const expect = require('chai').expect;

const { Types } = require('mongoose');

const { userEventDefinition } = require('../../../../src/db/schemas/user-event');
const { testForInvalidModel, testForValidModel, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { UserEvent } = require('../../../../src/db/models');

const userEventDoc = {
    start: 0,
    end: 10
};

let userEvent = new UserEvent(userEventDoc);

beforeEach(() => userEvent = getNewModelInstance(UserEvent, userEventDoc));