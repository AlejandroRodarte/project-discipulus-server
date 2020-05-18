const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { sampleFiles } = require('../../shared');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedUsers = persisted.db[db.names.user.modelName];

const teacherFiles = [

    // 0. associate teacher file to unknown user
    ...util.generateOneToMany('user', new Types.ObjectId(), [{ file: models.generateFakeFile() }]),

    // 1. associate teacher file to user[0] (disabled teacher)
    ...util.generateOneToMany('user', persistedUsers[0]._id, [{ file: models.generateFakeFile() }]),

    // 2. associate teacher file to user[1] (enabled parent)
    ...util.generateOneToMany('user', persistedUsers[1]._id, [{ file: models.generateFakeFile() }]),

    ...util.generateOneToMany('user', persistedUsers[2]._id, [

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
        [db.names.teacherFile.modelName]: teacherFiles
    }
};
