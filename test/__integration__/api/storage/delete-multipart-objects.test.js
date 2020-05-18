const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { functions, shared } = require('../../../__fixtures__');
const { storage } = require('../../../../src/api');

const expect = chai.expect;
chai.use(chaiAsPromised);

const persisted = {
    storage: {
        test: functions.util.attachKeynames([
            shared.sampleFiles.sheetFile,
            shared.sampleFiles.pdfFile
        ])
    }
};

describe('[api/storage/delete-multipart-objects] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(functions.storage.init(persisted.storage));

    const testFiles = persisted.storage.test;

    it('Should properly delete all files from a bucket', async () => {

        const keynames = testFiles.map(file => file.keyname);
        await expect(storage.deleteBucketObjects(storage.config.bucketNames.test, keynames)).to.eventually.be.fulfilled;

        const bucketKeys = await storage.listBucketKeys(storage.config.bucketNames.test);

        expect(bucketKeys.length).to.equal(0);

    });

    this.afterEach(functions.storage.teardown(persisted.storage));

});
