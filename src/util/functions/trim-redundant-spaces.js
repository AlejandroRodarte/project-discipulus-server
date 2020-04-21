const { trimCornerSpaces, reduceMiddleSpaces } = require('../regexp');

const trimRedundantSpaces = string => string.replace(trimCornerSpaces, '').replace(reduceMiddleSpaces, ' ');

module.exports = trimRedundantSpaces;
