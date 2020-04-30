const cos = require('./config/cos');

const getMultipartObject = async (bucketName, itemName) => {

    try {

        const data = await cos.getObject({
            Bucket: bucketName,
            Key: itemName
        }).promise();

        const { Body: buffer, ContentType: contentType } = data;
    
        return { buffer, contentType };

    } catch (e) {
        throw e;
    }

};

module.exports = getMultipartObject;
