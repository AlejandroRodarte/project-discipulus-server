const { Types } = require('mongoose');

const { sharedUserFileDefinition } = require('../../../../../src/db/schemas/shared/user-file');
const { testForInvalidModelAsync, testForValidModelAsync, getNewModelInstance, generateFakeFile } = require('../../../../__fixtures__/functions/models');

const { UserFile } = require('../../../../../src/db/models/shared');

const userFileDoc = {
    user: new Types.ObjectId(),
    file: generateFakeFile()
};

let userFile = new UserFile(userFileDoc);

beforeEach(() => userFile = getNewModelInstance(UserFile, userFileDoc));

describe('[db/models/shared/user-file] - invalid user', () => {

    it('Should not validate user-file if a user id is not defined', () => {
        userFile.user = undefined;
        testForInvalidModelAsync(userFile, sharedUserFileDefinition.user.required);
    });

});

describe('[db/models/shared/user-file] - invalid file', () => {

    it('Should not validate user-file if a file is not defined', () => {
        userFile.file = undefined;
        testForInvalidModelAsync(userFile, sharedUserFileDefinition.file.required);
    });

});

describe('[db/models/shared/user-file] - valid user-file', () => {

    it('Should validate user-file with correct user id and file object', () => {
        testForValidModelAsync(userFile);
    });

});
