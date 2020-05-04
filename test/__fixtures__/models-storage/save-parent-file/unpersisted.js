const { Types } = require('mongoose');
const generateOneToMany = require('../../functions/util/generate-one-to-many');
const { generateFakeFile } = require('../../functions/models');

const sampleFiles = require('../../shared/sample-files');
const { user, parentFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted.db[user.modelName];

const parentFiles = [

    // 0. associate parent file to unknown user
    ...generateOneToMany('user', new Types.ObjectId(), [{ file: generateFakeFile() }]),

    // 1. associate parent file to user[0] (disabled parent)
    ...generateOneToMany('user', persistedUsers[0]._id, [{ file: generateFakeFile() }]),

    // 2. associate parent file to user[1] (enabled student)
    ...generateOneToMany('user', persistedUsers[1]._id, [{ file: generateFakeFile() }]),

    ...generateOneToMany('user', persistedUsers[2]._id, [

        // 3. associate parent file to user[2] (enabled parent), but it has the same originalname as
        // the one it already has persisted
        { 
            file: {
                ...sampleFiles.documentFile,
                _id: new Types.ObjectId()
            }
        },

        // 4. associate parent file to user[2] (enabled parent) with a new sheet file
        {
            file: sampleFiles.sheetFile
        }

    ])

];

module.exports = {
    db: {
        [parentFile.modelName]: parentFiles
    }
};
