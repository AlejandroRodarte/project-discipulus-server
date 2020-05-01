const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { deleteBucketObjects, listBucketKeys } = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');
const attachKeynames = require('../../../__fixtures__/functions/util/attach-keynames');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const storage = require('../../../__fixtures__/functions/storage');

const expect = chai.expect;
chai.use(chaiAsPromised);

const persisted = {
    storage: {
        test: attachKeynames([
            sampleFiles.sheetFile,
            sampleFiles.pdfFile
        ])
    }
};

describe('[api/storage/delete-multipart-objects] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(storage.init(persisted.storage));

    const testFiles = persisted.storage.test;

    it('Should properly delete all files from a bucket', async () => {

        const keynames = testFiles.map(file => file.keyname);
        await expect(deleteBucketObjects(bucketNames.test, keynames)).to.eventually.be.fulfilled;

        const bucketKeys = await listBucketKeys(bucketNames.test);

        expect(bucketKeys.length).to.equal(0);

    });

    this.afterEach(storage.teardown(persisted.storage));

});
