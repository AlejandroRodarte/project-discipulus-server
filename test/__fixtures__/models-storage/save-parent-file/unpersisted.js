const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');
const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted.db[db.names.user.modelName];

const parentFiles = [

    // 0. associate parent file to unknown user
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ file: models.generateFakeFile() }]),

    // 1. associate parent file to user[0] (disabled parent)
    ...util.generateOneToMany('user', persistedUsers[0]._id, [{ file: models.generateFakeFile() }]),

    // 2. associate parent file to user[1] (enabled student)
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ file: models.generateFakeFile() }]),

    ...util.generateOneToMany('user', persistedUsers[2]._id, [

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
        [db.names.parentFile.modelName]: parentFiles
    }
};
