const { homework } = require('../../names');

const getHomeworkType = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: homework.collectionName,
            localField: 'homework',
            foreignField: '_id',
            as: 'homework'
        }
    },
    {
        $unwind: '$homework'
    },
    {
        $project: {
            type: '$homework.type'
        }
    }
];

module.exports = getHomeworkType;
