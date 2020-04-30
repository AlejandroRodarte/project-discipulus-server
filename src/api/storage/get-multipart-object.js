const cos = require('./cos/cos');

const getMultipartObject = async (bucketName, itemName) => {

    const data = await cos.getObject({
        Bucket: bucketName,
        Key: itemName
    }).promise();

    const { Body: buffer, ContentType: contentType } = data;

    return { buffer, contentType };

};

module.exports = getMultipartObject;
