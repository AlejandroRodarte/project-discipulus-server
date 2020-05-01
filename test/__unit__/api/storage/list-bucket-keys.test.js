const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');

const { listBucketKeys } = require('../../../../src/api/storage');
const cos = require('../../../../src/api/storage/config/cos');

const expect = chai.expect;
chai.use(chaiAsPromised);

const bucketName = 'sample-bucket';

describe('[api/storage/list-bucket-keys] - cos.listObjects', () => {

    let listObjectsStub;

    it('Should call cos.listObjects with correct arguments and throw error if promise resolves', async () => {

        listObjectsStub = sinon.stub(cos, 'listObjects').returns({
            promise: () => Promise.reject(new Error('Error while fetching bucket objects'))
        });

        await expect(listBucketKeys(bucketName)).to.eventually.be.rejectedWith(Error);

        sinon.assert.calledOnceWithExactly(listObjectsStub, {
            Bucket: bucketName
        });

    });

    afterEach(() => {
        listObjectsStub.restore();
    });

});

describe('[api/storage/list-bucket-keys] - happy path', () => {

    let listObjectsStub;

    it('Should resolve bucket keynames if cos.listObjects resolves', async () => {

        const data = {
            Contents: [
                {
                    Key: 'key-1.png'
                },
                {
                    Key: 'key-2.txt'
                }
            ]
        };

        listObjectsStub = sinon.stub(cos, 'listObjects').returns({
            promise: () => Promise.resolve(data)
        });

        await expect(listBucketKeys(bucketName)).to.eventually.be.eql(data.Contents.map(item => item.Key));

    });

    afterEach(() => {
        listObjectsStub.restore();
    });

});
