const cos = require('./cos/cos');

const listBucketObjects = async (bucketName) => {

    const data = await cos.listObjects({
        Bucket: bucketName
    }).promise();

    return data.Contents.map(item => item.Key);

};

module.exports = listBucketObjects;
