const { Types } = require('mongoose');
const generateOneToMany = require('../../functions/util/generate-one-to-many');
const { generateFakeFile } = require('../../functions/models');

const sampleFiles = require('../../shared/sample-files');
const { user, userFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted.db[user.modelName];

const usersFiles = [

    // 0. associate file to unknown user
    ...generateOneToMany('user', new Types.ObjectId(), [{ file: generateFakeFile() }]),

    // 1. associate file to user[0] (disabled)
    ...generateOneToMany('user', persistedUsers[0]._id, [{ file: generateFakeFile() }]),

    ...generateOneToMany('user', persistedUsers[1]._id, [

        // 2. associate user[1] the exact same pptx file it already has persisted
        { 
            file: {
                ...sampleFiles.presentationFile,
                _id: new Types.ObjectId()
            }
        },

        // 3. associate user[1] with a sample document file
        {
            file: sampleFiles.documentFile
        }

    ])

];

module.exports = {
    db: {
        [userFile.modelName]: usersFiles
    }
};
