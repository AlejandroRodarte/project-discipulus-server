const { Types } = require('mongoose');

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const userNoteDoc = {
    user: new Types.ObjectId(),
    note: fixtures.functions.models.generateFakeNote({
        titleWords: 5,
        descriptionWords: 10,
        markdown: '# Some good stuff'
    })
};

let userNote = new db.models.shared.UserNote(userNoteDoc);

beforeEach(() => userNote = fixtures.functions.models.getNewModelInstance(db.models.shared.UserNote, userNoteDoc));

describe('[db/models/shared/user-note] - invalid user', () => {

    it('Should not validate user-note if a user id is not defined', () => {
        userNote.user = undefined;
        fixtures.functions.models.testForInvalidModel(userNote, db.schemas.shared.definitions.sharedUserNoteDefinition.user.required);
    });

});

describe('[db/models/shared/user-note] - invalid note', () => {

    it('Should not validate user-note if a note is not defined', () => {
        userNote.note = undefined;
        fixtures.functions.models.testForInvalidModel(userNote, db.schemas.shared.definitions.sharedUserNoteDefinition.note.required);
    });

});

describe('[db/models/shared/user-note] - valid user-note', () => {

    it('Should validate user-note with correct user id and note object', () => {
        fixtures.functions.models.testForValidModel(userNote);
    });

});
