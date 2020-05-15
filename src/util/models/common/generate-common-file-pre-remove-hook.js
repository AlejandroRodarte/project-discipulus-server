const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generateCommonFilePreRemoveHook = ({ modelName }) => async function() {

    const doc = this;

    try {
        await storageApi.deleteBucketObjects(bucketNames[modelName], [doc.file.keyname]);
    } catch {
        throw e;
    }

};
