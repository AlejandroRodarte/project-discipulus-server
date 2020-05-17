const fs = require('fs');

const { BASE_ASSETS_PATH } = require('../../config/values');

const getAssetBuffer = (name) => fs.readFileSync(`${BASE_ASSETS_PATH}/${name}`);

module.exports = getAssetBuffer;
