const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { getMultipartObject } = require('../../../../src/api/storage');
const cos = require('../../../../src/api/storage/config/cos');

const expect = chai.expect;
chai.use(chaiAsPromised);

const bucketName = 'sample-bucket';
const itemName = 'sample-file.txt';

describe('[api/storage/get-multipart-object] - cos.getObject', () => {

    let getObjectStub;

    it('Should call cos.getObject with correct arguments and throw error if promise rejects', async () => {

        getObjectStub = sinon.stub(cos, 'getObject').returns({
            promise: () => Promise.reject(new Error('Object not found'))
        });

        await expect(getMultipartObject(bucketName, itemName)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(getObjectStub, {
            Bucket: bucketName,
            Key: itemName
        });

    });

    afterEach(() => {
        getObjectStub.restore();
    });

});

describe('[api/storage/get-multipart-object] - happy path', () => {

    let getObjectStub;

    it('Should resolve buffer and content type if object is found', async () => {

        const buffer = Buffer.alloc(10);
        const mimetype = 'text/plain';

        getObjectStub = sinon.stub(cos, 'getObject').returns({
            promise: () => Promise.resolve({
                Body: buffer,
                ContentType: mimetype
            })
        });

        await expect(getMultipartObject(bucketName, itemName)).to.eventually.be.eql({
            buffer,
            contentType: mimetype
        });

    });

    afterEach(() => {
        getObjectStub.restore();
    });

});
