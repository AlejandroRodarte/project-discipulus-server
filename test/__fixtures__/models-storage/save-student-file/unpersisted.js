const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted.db[db.names.user.modelName];

const studentFiles = [

    // 0. associate student file to unknown user
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ file: models.generateFakeFile() }]),

    // 1. associate student file to user[0] (disabled student)
    ...util.generateOneToMany('user', persistedUsers[0]._id, [{ file: models.generateFakeFile() }]),

    // 2. associate student file to user[1] (enabled teacher)
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ file: models.generateFakeFile() }]),

    ...util.generateOneToMany('user', persistedUsers[2]._id, [

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
        [db.names.studentFile.modelName]: studentFiles
    }
};
