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

const [homeworkStudentNoteDoc] = fixtures.functions.util.generateOneToMany('homeworkStudent', new Types.ObjectId(), [{ note: fixtures.functions.models.generateFakeNote() }]);
let homeworkStudentNote = new db.models.HomeworkStudentNote(homeworkStudentNoteDoc);

beforeEach(() => homeworkStudentNote = fixtures.functions.models.getNewModelInstance(db.models.HomeworkStudentNote, homeworkStudentNoteDoc));

describe('[db/models/homework-student-note] - Invalid homeworkStudent _id', () => {

    it('Should not validate if homeworkStudent _id is undefined', () => {
        homeworkStudentNote.homeworkStudent = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentNote, db.schemas.definitions.homeworkStudentNoteDefinition.homeworkStudent.required);
    });

});

describe('[db/models/homework-student-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        homeworkStudentNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(homeworkStudentNote, db.schemas.definitions.homeworkStudentNoteDefinition.note.required);
    });

});

describe('[db/models/homework-student-note] - valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(homeworkStudentNote);
    });

});