const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { functions, shared } = require('../../../__fixtures__');
const { storage } = require('../../../../src/api');

const expect = chai.expect;
chai.use(chaiAsPromised);

const persisted = {
    storage: {
        test: functions.util.attachKeynames([
            shared.sampleFiles.zipFile,
            shared.sampleFiles.presentationFile
        ])
    }
};

describe('[api/storage/list-bucket-keys] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(functions.storage.init(persisted.storage));

    const testFiles = persisted.storage.test;

    it('Should properly list all bucket keys', async () => {
        const keynames = testFiles.map(file => file.keyname);
        await expect(storage.listBucketKeys(storage.config.bucketNames.test)).to.eventually.have.members(keynames);
    });

    this.afterEach(functions.storage.teardown(persisted.storage));

});
