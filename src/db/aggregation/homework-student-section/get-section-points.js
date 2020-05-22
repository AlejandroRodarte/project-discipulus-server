const { db } = require('../../../shared');

const getSectionPoints = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: db.names.homeworkSection.collectionName,
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
