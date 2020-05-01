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
            sampleFiles.zipFile,
            sampleFiles.presentationFile
        ])
    }
};

describe('[api/storage/list-bucket-keys] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(storage.init(persisted.storage));

    const testFiles = persisted.storage.test;

    it('Should properly list all bucket keys', async () => {
        const keynames = testFiles.map(file => file.keyname);
        await expect(listBucketKeys(bucketNames.test)).to.eventually.have.members(keynames);
    });

    this.afterEach(storage.teardown(persisted.storage));

});
