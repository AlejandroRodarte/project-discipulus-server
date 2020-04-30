const expect = require('chai').expect;
const sinon = require('sinon');

const { deleteBucketObjects } = require('../../../../src/api/storage');
const cos = require('../../../../src/api/storage/config/cos');

const bucketName = 'sample-bucket';
const keynames = ['file-1.txt', 'sample-doc.docx', 'report.pdf'];

describe('[api/storage/delete-bucket-objects] - cos.deleteObjects', () => {

    let deleteObjectsStub;

    beforeEach(() => {
        deleteObjectsStub = sinon.stub(cos, 'deleteObjects').returns({
            promise: () => Promise.reject(new Error('Error while deleting objects'))
        });
    });

    it('Should call cos.deleteObjects with correct arguments and throw error if promise is rejected', async () => {

        await expect(deleteBucketObjects(bucketName, keynames)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(deleteObjectsStub, {
            Bucket: bucketName,
            Delete: {
                Objects: keynames.map(keyname => ({ Key: keyname }))
            }
        });

    });

    afterEach(() => {
        deleteObjectsStub.restore();
    });

});

describe('[api/storage/delete-bucket-objects] - happy path', () => {

    let deleteObjectsStub;
    const deletedObjectsResponse = keynames.map(keyname => ({ Key: keyname }));

    beforeEach(() => {
        deleteObjectsStub = sinon.stub(cos, 'deleteObjects').returns({
            promise: () => Promise.resolve({
                Deleted: deletedObjectsResponse
            })
        });
    });

    it('Should resolve if cos.deleteObjects resolves properly', async () => {
        await expect(deleteBucketObjects(bucketName, keynames)).to.eventually.be.eql(deletedObjectsResponse);
    });

    afterEach(() => {
        deleteObjectsStub.restore();
    });

});
