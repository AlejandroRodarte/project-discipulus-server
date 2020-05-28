const fields = require('./fields');

module.exports = {
    [fields.HOMEWORK_TITLE]: 'homeworkData.title',
    [fields.HOMEWORK_TYPE]: 'homeworkData.type',
    [fields.HOMEWORK_TIMERANGE_START]: 'homeworkData.timeRange.start',
    [fields.HOMEWORK_GRADE]: 'homeworkData.grade',
    [fields.HOMEWORK_TIMERANGE_END]: 'homeworkData.timeRange.end',
};