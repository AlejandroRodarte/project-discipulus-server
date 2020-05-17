const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { BASE_ASSETS_PATH } = require('../../../__fixtures__/config/values');
const { createMultipartObject } = require('../../../../src/api/storage');
const sampleFiles = require('../../../__fixtures__/shared/sample-files');
const attachKeynames = require('../../../__fixtures__/functions/util/attach-keynames');
const bucketNames = require('../../../../src/api/storage/config/bucket-names');
const storage = require('../../../__fixtures__/functions/storage');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[api/storage/create-multipart-object] - service connection', function() {

    this.timeout(20000);

    const unpersisted = {
        storage: {
            test: attachKeynames([
                sampleFiles.jpgImage
            ])
        }
    };

    it('Should persist a sample file to the service properly', async () => {

        const [file] = unpersisted.storage.test;

        const buffer = fs.readFileSync(`${BASE_ASSETS_PATH}/${file.originalname}`);

        await expect(createMultipartObject(bucketNames.test, {
            keyname: file.keyname,
            buffer,
            size: buffer.length,
            mimetype: file.mimetype
        })).to.eventually.be.fulfilled;

    });

    this.afterEach(storage.teardown(unpersisted.storage));

});
