const { Types } = require('mongoose');
const generateOneToMany = require('../../functions/util/generate-one-to-many');
const { generateFakeFile } = require('../../functions/models');

const sampleFiles = require('../../shared/sample-files');
const { user, teacherFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted.db[user.modelName];

const teacherFiles = [

    // 0. associate teacher file to unknown user
    ...generateOneToMany('user', new Types.ObjectId(), [{ file: generateFakeFile() }]),

    // 1. associate teacher file to user[0] (disabled teacher)
    ...generateOneToMany('user', persistedUsers[0]._id, [{ file: generateFakeFile() }]),

    // 2. associate teacher file to user[1] (enabled parent)
    ...generateOneToMany('user', persistedUsers[1]._id, [{ file: generateFakeFile() }]),

    ...generateOneToMany('user', persistedUsers[2]._id, [

        // 3. associate teacher file to user[2] (enabled teacher), but it has the same originalname as
        // the one it already has persisted
        { 
            file: {
                ...sampleFiles.zipFile,
                _id: new Types.ObjectId()
            }
        },

        // 4. associate teacher file to user[2] (enabled teacher) with a new sheet file
        {
            file: sampleFiles.textFile
        }

    ])

];

module.exports = {
    db: {
        [teacherFile.modelName]: teacherFiles
    }
};
