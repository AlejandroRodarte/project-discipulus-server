const storageApi = require('../../../api/storage');
const bucketNames = require('../../../api/storage/config/bucket-names');

const generateCommonSaveFileAndDoc = ({ modelName, parentModelName, ref, notFoundErrorMessage }) => async function(buffer) {

    const doc = this;
    const Model = doc.model(parentModelName);

    const parentDocExists = await Model.findOne({
        _id: doc[ref]
    });

    if (!parentDocExists) {
        throw new Error(notFoundErrorMessage);
    }

    try {
        await doc.save();
    } catch (e) {
        throw e;
    }

    try {
        await storageApi.createMultipartObject(bucketNames[modelName], {
            keyname: doc.file.keyname,
            buffer,
            size: buffer.length,
            mimetype: doc.file.mimetype
        });
    } catch (e) {
        await doc.remove();
        throw e;
    }

    return doc;

};

module.exports = generateCommonSaveFileAndDoc;
