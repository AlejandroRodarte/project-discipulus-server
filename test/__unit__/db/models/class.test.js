const expect = require('chai').expect;

const { Types } = require('mongoose');
const lorem = require('../../../__fixtures__/util/lorem');

const { classDefinition } = require('../../../../src/db/schemas/class');
const { testForInvalidModel, testForValidModel, getNewModelInstance } = require('../../../__fixtures__/functions/models');

const { Class } = require('../../../../src/db/models');

const sampleFiles = require('../../../__fixtures__/shared/sample-files');

const classDoc = {
    user: new Types.ObjectId(),
    title: lorem.generateWords(5),
    description: lorem.generateWords(20),
    avatar: sampleFiles.pngImage,
    sessions: [
        {
            start: 0,
            end: 20
        },
        {
            start: 30,
            end: 40
        },
        {
            start: 50,
            end: 60
        }
    ]
};

let clazz = new Class(classDoc);

beforeEach(() => clazz = getNewModelInstance(Class, classDoc));


