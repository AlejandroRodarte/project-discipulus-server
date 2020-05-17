const { cos } = require('./config');

const cancelMultipartObject = async (bucketName, itemName, uploadId) => {

    try {

        await cos.abortMultipartUpload({
            Bucket: bucketName,
            Key: itemName,
            UploadId: uploadId
        }).promise();
        
    } catch (e) {
        throw e;
    }

};

const createMultipartObject = async (bucketName, { keyname, buffer, size, mimetype }) => {

    let uploadId = null;

    try {

        const data = await cos.createMultipartUpload({
            Bucket: bucketName,
            Key: keyname,
            ContentType: mimetype
        }).promise();
    
        uploadId = data.UploadId;

        const partSize = (+process.env.FILE_CHUNK_SIZE_MB || 5) * 1024 * 1024;
        const parts = Math.ceil(size / partSize);

        const chunks = [];

        for (const [partNumber, _] of [...Array(parts)].entries()) {

            const startByte = partNumber * partSize;
            const endByte = Math.min((partNumber + 1) * partSize - 1, size);

            const data = await cos.uploadPart({
                Body: buffer.slice(startByte, endByte),
                Bucket: bucketName,
                Key: keyname,
                PartNumber: partNumber + 1,
                UploadId: uploadId
            }).promise();

            chunks.push({
                ETag: data.ETag,
                PartNumber: partNumber + 1
            });

        }

        await cos.completeMultipartUpload({
            Bucket: bucketName,
            Key: keyname,
            MultipartUpload: {
                Parts: chunks
            },
            UploadId: uploadId
        }).promise();

    } catch (e) {

        try {

            if (uploadId) {
                await cancelMultipartObject(bucketName, keyname, uploadId);
            }

        } catch {
            throw e;
        }

        throw e;

    } 

};

module.exports = createMultipartObject;
