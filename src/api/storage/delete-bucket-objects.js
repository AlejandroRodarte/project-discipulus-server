const cos = require('./config/cos');

const deleteBucketObjects = async (bucketName, keynames) => {

    if (!keynames.length) {
        return [];
    }

    const objects = keynames.map(keyname => ({ Key: keyname }));

    try {

        const data = await cos.deleteObjects({
            Bucket: bucketName,
            Delete: {
                Objects: objects
            }
        }).promise();

        return data.Deleted;

    } catch (e) {
        throw e;
    }


};

module.exports = deleteBucketObjects;
