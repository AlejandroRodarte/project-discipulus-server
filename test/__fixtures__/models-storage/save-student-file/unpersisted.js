const { Types } = require('mongoose');
const generateOneToMany = require('../../functions/util/generate-one-to-many');
const { generateFakeFile } = require('../../functions/models');

const sampleFiles = require('../../shared/sample-files');
const { user, studentFile } = require('../../../../src/db/names');

const persisted = require('./persisted');

const persistedUsers = persisted.db[user.modelName];

const studentFiles = [

    // 0. associate student file to unknown user
    ...generateOneToMany('user', new Types.ObjectId(), [{ file: generateFakeFile() }]),

    // 1. associate student file to user[0] (disabled student)
    ...generateOneToMany('user', persistedUsers[0]._id, [{ file: generateFakeFile() }]),

    // 2. associate student file to user[1] (enabled teacher)
    ...generateOneToMany('user', persistedUsers[1]._id, [{ file: generateFakeFile() }]),

    ...generateOneToMany('user', persistedUsers[2]._id, [

        // 3. associate student file to user[2] (enabled student), but it has the same originalname as
        // the one it already has persisted
        { 
            file: {
                ...sampleFiles.sheetFile,
                _id: new Types.ObjectId()
            }
        },

        // 4. associate student file to user[2] (enabled student) with a new sheet file
        {
            file: sampleFiles.pdfFile
        }

    ])

];

module.exports = {
    db: {
        [studentFile.modelName]: studentFiles
    }
};
