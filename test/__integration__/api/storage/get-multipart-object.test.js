const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { config, functions, shared } = require('../../../__fixtures__');
const { storage } = require('../../../../src/api');

const expect = chai.expect;
chai.use(chaiAsPromised);

const persisted = {
    storage: {
        test: functions.util.attachKeynames([
            shared.sampleFiles.documentFile
        ])
    }
};

describe('[api/storage/get-multipart-object] - service connection', function() {

    this.timeout(20000);

    this.beforeEach(functions.storage.init(persisted.storage));

    const testFile = persisted.storage.test[0];

    it('Should properly return buffer and content type of bucket object', async () => {

        const buffer = fs.readFileSync(`${config.values.BASE_ASSETS_PATH}/${testFile.originalname}`);

        await expect(storage.getMultipartObject(storage.config.bucketNames.test, testFile.keyname)).to.eventually.eql({
            buffer,
            contentType: testFile.mimetype
        });

    });

    this.afterEach(functions.storage.teardown(persisted.storage));

});
