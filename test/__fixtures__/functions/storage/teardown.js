const { deleteBucketObjects, listBucketKeys } = require('../../../../src/api/storage');

const bucketNames = require('../../../../src/api/storage/config/bucket-names');

const teardown = (persistedContext) => async () => {

    const bucketKeys = Object.keys(persistedContext);

    for (const bucketKey of bucketKeys) {
        const keynames = await listBucketKeys(bucketNames[bucketKey]);
        await deleteBucketObjects(bucketNames[bucketKey], keynames);
    }

};

module.exports = teardown;
