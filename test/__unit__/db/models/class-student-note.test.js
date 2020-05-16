const { Types } = require('mongoose');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { ClassStudent, ClassStudentNote } = require('../../../../src/db/models');
const { classStudentNoteDefinition } = require('../../../../src/db/schemas/class-student-note');
const modelFunctions = require('../../../__fixtures__/functions/models');

const expect = chai.expect;
chai.use(chaiAsPromised);

const classStudentNoteDoc = {
    classStudent: new Types.ObjectId(),
    note: modelFunctions.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Test'
    })
};

let classStudentNote = new ClassStudentNote(classStudentNoteDoc);

beforeEach(() => classStudentNote = modelFunctions.getNewModelInstance(ClassStudentNote, classStudentNoteDoc));

describe('[db/models/class-student-note] - Invalid classStudent', () => {

    it('Should not validate if classStudent id is undefined', () => {
        classStudentNote.classStudent = undefined;
        modelFunctions.testForInvalidModel(classStudentNote, classStudentNoteDefinition.classStudent.required);
    });

});

describe('[db/models/class-student-note] - Invalid note', () => {

    it('Should not validate if note is undefined', () => {
        classStudentNote.note = undefined;
        modelFunctions.testForInvalidModel(classStudentNote, classStudentNoteDefinition.note.required);
    });

});

describe('[db/models/class-student-note] - Valid model', () => {

    it('Should validate correct model', () => {
        modelFunctions.testForValidModel(classStudentNote);
    });

});

describe('[db/models/class-student-note] - methods.checkAndSave', () => {

    let classStudentExistsStub;
    let classStudentNoteSaveStub;

    it('Generated function should call methods with correct args and return class-student-note doc', async () => {

        classStudentExistsStub = sinon.stub(ClassStudent, 'exists').resolves(true);
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
