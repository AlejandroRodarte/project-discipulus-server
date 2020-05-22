const { Types } = require('mongoose');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const shared = require('../../../../src/shared');
const api = require('../../../../src/api');
const util = require('../../../../src/util');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const [homeworkNoteDoc] = fixtures.functions.util.generateOneToMany('homework', new Types.ObjectId(), [{ note: fixtures.functions.models.generateFakeNote() }]);
let homeworkNote = new db.models.HomeworkNote(homeworkNoteDoc);

beforeEach(() => homeworkNote = fixtures.functions.models.getNewModelInstance(db.models.HomeworkNote, homeworkNoteDoc));

describe('[db/models/homework-note] - Invalid homework _id', () => {

    it('Should not validate if homework _id is undefined', () => {
        homeworkNote.homework = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkNote, db.schemas.definitions.homeworkNoteDefinition.homework.required);
    });

});

describe('[db/models/homework-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        homeworkNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkNote, db.schemas.definitions.homeworkNoteDefinition.note.required);
    });

});

describe('[db/models/homework-note] - Default published flag', () => {

    it('Should default published flag to false', () => {
        expect(homeworkNote.published).to.equal(false);
    });

});

describe('[db/models/homework-note] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(homeworkNote);
    });

});
