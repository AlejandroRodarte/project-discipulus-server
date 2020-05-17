const storageApi = require('../../../api/storage');

const generateSaveFileAndDoc = ({ modelName }) => async function() {

    const fileDoc = this;

    try {
        await storageApi.deleteBucketObjects(storageApi.config.bucketNames[modelName], [fileDoc.file.keyname]);
    } catch (e) {
        throw e;
    }

};

module.exports = generateSaveFileAndDoc;
