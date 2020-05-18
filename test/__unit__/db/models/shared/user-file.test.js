const { Types } = require('mongoose');

const db = require('../../../../../src/db');
const fixtures = require('../../../../__fixtures__');

const userFileDoc = {
    user: new Types.ObjectId(),
    file: fixtures.functions.models.generateFakeFile()
};

let userFile = new db.models.shared.UserFile(userFileDoc);

beforeEach(() => userFile = fixtures.functions.models.getNewModelInstance(db.models.shared.UserFile, userFileDoc));

describe('[db/models/shared/user-file] - invalid user', () => {

    it('Should not validate user-file if a user id is not defined', () => {
        userFile.user = undefined;
        fixtures.functions.models.testForInvalidModel(userFile, db.schemas.shared.definitions.sharedUserFileDefinition.user.required);
    });

});

describe('[db/models/shared/user-file] - invalid file', () => {

    it('Should not validate user-file if a file is not defined', () => {
        userFile.file = undefined;
        fixtures.functions.models.testForInvalidModel(userFile, db.schemas.shared.definitions.sharedUserFileDefinition.file.required);
    });

});

describe('[db/models/shared/user-file] - valid user-file', () => {

    it('Should validate user-file with correct user id and file object', () => {
        fixtures.functions.models.testForValidModel(userFile);
    });

});
