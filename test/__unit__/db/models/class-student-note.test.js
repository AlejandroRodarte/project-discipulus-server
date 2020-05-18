const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const db = require('../../../../src/db');
const fixtures = require('../../../__fixtures__');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classStudentNoteDoc = {
    classStudent: new Types.ObjectId(),
    note: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let classStudentNote = new db.models.ClassStudentNote(classStudentNoteDoc);

beforeEach(() => classStudentNote = fixtures.functions.models.getNewModelInstance(db.models.ClassStudentNote, classStudentNoteDoc));

describe('[db/models/class-student-note] - Invalid classStudent', () => {

    it('Should not validate if classStudent id is undefined', () => {
        classStudentNote.classStudent = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentNote, db.schemas.definitions.classStudentNoteDefinition.classStudent.required);
    });

});

describe('[db/models/class-student-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        classStudentNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(classStudentNote, db.schemas.definitions.classStudentNoteDefinition.note.required);
    });

});

describe('[db/models/class-student-note] - Valid model', () => {

    it('Should validate correct model', () => {
        fixtures.functions.models.testForValidModel(classStudentNote);
    });

});

describe('[db/models/class-student-note] - methods.checkAndSave', () => {

    let classStudentExistsStub;
    let classStudentNoteSaveStub;

    it('Generated function should call methods with correct args and return class-student-note doc', async () => {

        classStudentExistsStub = sinon.stub(db.models.ClassStudent, 'exists').resolves(true);
        classStudentNoteSaveStub = sinon.stub(classStudentNote, 'save').resolves(classStudentNote);

        await expect(classStudentNote.checkAndSave()).to.eventually.eql(classStudentNote);

        sinon.assert.calledOnceWithExactly(classStudentExistsStub, {
            _id: classStudentNote.classStudent
        });

        sinon.assert.calledOnce(classStudentNoteSaveStub);

    });

    afterEach(() => {
        sinon.restore();
    });

});
