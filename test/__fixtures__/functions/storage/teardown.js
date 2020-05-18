const { storage } = require('../../../../src/api');

const teardown = (persistedContext) => async () => {

    const bucketKeys = Object.keys(persistedContext);

    for (const bucketKey of bucketKeys) {
        const keynames = await storage.listBucketKeys(storage.config.bucketNames[bucketKey]);
        await storage.deleteBucketObjects(storage.config.bucketNames[bucketKey], keynames);
    }

};

module.exports = teardown;
