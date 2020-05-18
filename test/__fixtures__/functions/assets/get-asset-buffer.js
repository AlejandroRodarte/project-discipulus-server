const fs = require('fs');

const { values } = require('../../config');

const getAssetBuffer = (name) => fs.readFileSync(`${values.BASE_ASSETS_PATH}/${name}`);

module.exports = getAssetBuffer;
