const { lorem } = require('../../util');

const { db } = require('../../../../src/shared');

const generateFakeHomework = ({
    titleWords = 5,
    descriptionWords = 10,
    type = db.models.class.gradeType.NO_SECTIONS,
    grade = 10,
    noTimeRange = true
} = {}) => ({
    title: lorem.generateWords(titleWords),
    description: lorem.generateWords(descriptionWords),
    type,
    grade,
    timeRange: noTimeRange ? undefined : {
        start: 30,
        end: 150
    }
});

module.exports = generateFakeHomework;
