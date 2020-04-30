const expect = require('chai').expect;
const sinon = require('sinon');

const { createMultipartObject } = require('../../../../src/api/storage');
const cos = require('../../../../src/api/storage/config/cos');

describe('[api/storage/create-multipart-object] - failure', () => {

    let sandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    let createMultipartUploadStub;
    let abortMultipartUploadStub;

    it('Should throw error if cos.createMultipartUpload fails and call it with the correct arguments', async () => {

        createMultipartUploadStub = sandbox.stub(cos, 'createMultipartUpload').returns({
            promise: () => Promise.reject(new Error('Error while creating multipart object'))
        });

        const bucketName = 'sample-bucket-name';
        const keyname = 'file.txt';
        const mimetype = 'text/plain';

        expect(createMultipartObject(bucketName, {
            keyname: keyname,
            buffer: Buffer.alloc(1),
            size: 1,
            mimetype: mimetype
        })).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(createMultipartUploadStub, {
            Bucket: bucketName,
            Key: keyname,
            ContentType: mimetype
        });

    });

    afterEach(() => {
        sandbox.restore();
    });

});
