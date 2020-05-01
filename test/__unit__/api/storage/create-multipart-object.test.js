const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { createMultipartObject } = require('../../../../src/api/storage');
const cos = require('../../../../src/api/storage/config/cos');

const bucketName = 'sample-bucket-name';
const keyname = 'file.txt';
const mimetype = 'text/plain';
const uploadId = 'some-id';
const eTag = 'some-tag';
const bufferSize = 10;
const buffer = Buffer.alloc(bufferSize);

const expect = chai.expect;
chai.use(chaiAsPromised);

const data = {
    keyname: keyname,
    buffer,
    size: bufferSize,
    mimetype: mimetype
};

describe('[api/storage/create-multipart-object] - cos.createMultipartUpload', () => {

    let stub;

    it('Should call cos.createMultipartUpload with the correct arguments and throw error if promise rejects', async () => {

        stub = sinon.stub(cos, 'createMultipartUpload').returns({
            promise: () => Promise.reject(new Error('Error while creating multipart object'))
        });

        await expect(createMultipartObject(bucketName, data)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(stub, {
            Bucket: bucketName,
            Key: keyname,
            ContentType: mimetype
        });

    });

    afterEach(() => {
        stub.restore();
    });

});

describe('[api/storage/create-multipart-object] - cos.uploadPart', () => {

    let createMultipartUploadStub;
    let uploadPartStub;
    let abortMultipartUploadStub;

    beforeEach(() => {

        createMultipartUploadStub = sinon.stub(cos, 'createMultipartUpload').returns({
            promise: () => Promise.resolve({
                UploadId: uploadId
            })
        });

    });

    it('Should call cos.uploadPart with the correct arguments and throw error if promise rejects, calling cos.abortMultipartUpload with correct arguments', async () => {

        uploadPartStub = sinon.stub(cos, 'uploadPart').returns({
            promise: () => Promise.reject(new Error('Error while uploading a part'))
        });

        abortMultipartUploadStub = sinon.stub(cos, 'abortMultipartUpload').returns({
            promise: () => Promise.resolve()
        });

        await expect(createMultipartObject(bucketName, data)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(uploadPartStub, {
            Body: buffer.slice(0, 10),
            Bucket: bucketName,
            Key: keyname,
            PartNumber: 1,
            UploadId: uploadId
        });

        sinon.assert.calledOnceWithExactly(abortMultipartUploadStub, {
            Bucket: bucketName,
            Key: keyname,
            UploadId: uploadId
        });

    });

    afterEach(() => {
        createMultipartUploadStub.restore();
        uploadPartStub.restore();
        abortMultipartUploadStub.restore();
    });

});

describe('[api/storage/create-multipart-object] - cos.completeMultipartUpload', () => {

    let createMultipartUploadStub;
    let uploadPartStub;
    let completeMultipartUploadStub;
    let abortMultipartUploadStub;

    beforeEach(() => {

        createMultipartUploadStub = sinon.stub(cos, 'createMultipartUpload').returns({
            promise: () => Promise.resolve({
                UploadId: uploadId
            })
        });

        uploadPartStub = sinon.stub(cos, 'uploadPart').returns({
            promise: () => Promise.resolve({
                ETag: eTag
            })
        });

    });

    it('Should call cos.completeMultipartUpload with correct arguments and throw error if promise rejects, calling cos.abortMultipartUpload', async () => {

        completeMultipartUploadStub = sinon.stub(cos, 'completeMultipartUpload').returns({
            promise: () => Promise.reject(new Error('Error while completing multipart upload'))
        });

        abortMultipartUploadStub = sinon.stub(cos, 'abortMultipartUpload').returns({
            promise: () => Promise.resolve()
        });

        await expect(createMultipartObject(bucketName, data)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(completeMultipartUploadStub, {
            Bucket: bucketName,
            Key: keyname,
            MultipartUpload: {
                Parts: [{
                    ETag: eTag,
                    PartNumber: 1
                }]
            },
            UploadId: uploadId
        });

        sinon.assert.calledOnce(abortMultipartUploadStub);

    });

    afterEach(() => {
        createMultipartUploadStub.restore();
        uploadPartStub.restore();
        abortMultipartUploadStub.restore();
        completeMultipartUploadStub.restore();
    });

});

describe('[api/storage/create-multipart-object] - happy path', () => {

    let createMultipartUploadStub;
    let uploadPartStub;
    let completeMultipartUploadStub;

    beforeEach(() => {

        createMultipartUploadStub = sinon.stub(cos, 'createMultipartUpload').returns({
            promise: () => Promise.resolve({
                UploadId: uploadId
            })
        });

        uploadPartStub = sinon.stub(cos, 'uploadPart').returns({
            promise: () => Promise.resolve({
                ETag: eTag
            })
        });

        completeMultipartUploadStub = sinon.stub(cos, 'completeMultipartUpload').returns({
            promise: () => Promise.resolve()
        });

    });

    it('Should resolve if all required promises resolve', async () => {
        await expect(createMultipartObject(bucketName, data)).to.eventually.be.fulfilled;
    });

    afterEach(() => {
        createMultipartUploadStub.restore();
        uploadPartStub.restore();
        completeMultipartUploadStub.restore();
    });

});

