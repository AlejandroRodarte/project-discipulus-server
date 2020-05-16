const { Types } = require('mongoose');

const { sharedUserNoteDefinition } = require('../../../../../src/db/schemas/shared/user-note');
const { testForInvalidModel, testForValidModel, getNewModelInstance, generateFakeNote } = require('../../../../__fixtures__/functions/models');

const { UserNote } = require('../../../../../src/db/models/shared');

const userNoteDoc = {
    user: new Types.ObjectId(),
    note: generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Some good stuff'
    })
};

let userNote = new UserNote(userNoteDoc);

beforeEach(() => userNote = getNewModelInstance(UserNote, userNoteDoc));

describe('[db/models/shared/user-note] - invalid user', () => {

    it('Should not validate user-note if a user id is not defined', () => {
        userNote.user = undefined;
        testForInvalidModel(userNote, sharedUserNoteDefinition.user.required);
    });

});

describe('[db/models/shared/user-note] - invalid note', () => {

    it('Should not validate user-note if a note is not defined', () => {
        userNote.note = undefined;
        testForInvalidModel(userNote, sharedUserNoteDefinition.note.required);
    });

});

describe('[db/models/shared/user-note] - valid user-note', () => {

    it('Should validate user-note with correct user id and note object', () => {
        testForValidModel(userNote);
    });

});
