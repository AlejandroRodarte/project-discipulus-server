const { deleteBucketObjects } = require('../../../../src/api/storage');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const teardown = (persistedContext) => async () => {

    for (const bucketKey in persistedContext) {
        const keynames = persistedContext[bucketKey].map(file => file.keyname);
        await deleteBucketObjects(bucketNames[bucketKey], keynames);
    }

};

module.exports = teardown;
