const { storage } = require('../../../api');

const generateSaveFileAndDoc = ({ modelName }) => async function() {

    const fileDoc = this;

    try {
        await storage.deleteBucketObjects(storage.config.bucketNames[modelName], [fileDoc.file.keyname]);
    } catch (e) {
        throw e;
    }

};

module.exports = generateSaveFileAndDoc;
