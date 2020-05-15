const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generateSaveFileAndDoc = ({ modelName }) => async function() {

    const fileDoc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[modelName], [fileDoc.file.keyname]);
    } catch (e) {
        throw e;
    }

};

module.exports = generateSaveFileAndDoc;
