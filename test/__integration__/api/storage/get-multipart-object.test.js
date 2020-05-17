const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { BASE_ASSETS_PATH } = require('../../../__fixtures__/config/values');
const { getMultipartObject } = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');
const attachKeynames = require('../../../__fixtures__/functions/util/attach-keynames');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const storage = require('../../../__fixtures__/functions/storage');

const expect = chai.expect;
chai.use(chaiAsPromised);

const persisted = {
    storage: {
        test: attachKeynames([
            sampleFiles.documentFile
        ])
    }
};

describe('[api/storage/get-multipart-object] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(storage.init(persisted.storage));

    const testFile = persisted.storage.test[0];

    it('Should properly return buffer and content type of bucket object', async () => {

        const buffer = fs.readFileSync(`${BASE_ASSETS_PATH}/${testFile.originalname}`);

        await expect(getMultipartObject(bucketNames.test, testFile.keyname)).to.eventually.eql({
            buffer,
            contentType: testFile.mimetype
        });

    });

    this.afterEach(storage.teardown(persisted.storage));

});
