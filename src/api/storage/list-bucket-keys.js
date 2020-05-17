const { cos } = require('./config');

const listBucketObjects = async (bucketName) => {

    try {

        const data = await cos.listObjects({
            Bucket: bucketName
        }).promise();
    
        return data.Contents.map(item => item.Key);

    } catch (e) {
        throw e;
    }
    
};

module.exports = listBucketObjects;
