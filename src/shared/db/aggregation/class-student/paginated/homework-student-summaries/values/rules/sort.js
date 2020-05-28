const fields = require('../fields');
const types = require('./types');

module.exports = {
    [fields.POINTS_SUM]: types.POINTS_SUM,
    [fields.HOMEWORK_POINTS_SUM]: types.HOMEWORK_POINTS_SUM,
    [fields.GRADE]: types.GRADE,
    NONE: types.NONE
};