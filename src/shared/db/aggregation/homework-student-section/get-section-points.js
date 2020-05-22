const { homeworkSection } = require('../../names');

const getSectionPoints = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: homeworkSection.collectionName,
            localField: 'homeworkSection',
            foreignField: '_id',
            as: 'homeworkSection'
        }
    },
    {
        $unwind: '$homeworkSection'
    },
    {
        $project: {
            points: '$homeworkSection.points'
        }
    }
];

module.exports = getSectionPoints;
