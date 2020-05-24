const { regexp } = require('../../shared');

const trimRedundantSpaces = string => string.replace(regexp.trimCornerSpaces, '').replace(regexp.reduceMiddleSpaces, ' ');

module.exports = trimRedundantSpaces;
