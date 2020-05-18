const fs = require('fs');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const { config, functions, shared } = require('../../../__fixtures__');
const { storage } = require('../../../../src/api');

const expect = chai.expect;
chai.use(chaiAsPromised);

describe('[api/storage/create-multipart-object] - service connection', function() {

    this.timeout(20000);

    const unpersisted = {
        storage: {
            test: functions.util.attachKeynames([
                shared.sampleFiles.jpgImage
            ])
        }
    };

    it('Should persist a sample file to the service properly', async () => {

        const [file] = unpersisted.storage.test;

        const buffer = fs.readFileSync(`${config.values.BASE_ASSETS_PATH}/${file.originalname}`);

        await expect(storage.createMultipartObject(storage.config.bucketNames.test, {
            keyname: file.keyname,
            buffer,
            size: buffer.length,
            mimetype: file.mimetype
        })).to.eventually.be.fulfilled;

    });

    this.afterEach(functions.storage.teardown(unpersisted.storage));

});
