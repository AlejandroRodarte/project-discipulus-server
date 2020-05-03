const fs = require('fs');

const { BASE_ASSETS_PATH } = require('../../config/config');

const getAssetBuffer = (name) => fs.readFileSync(`${BASE_ASSETS_PATH}/${name}`);

module.exports = getAssetBuffer;
