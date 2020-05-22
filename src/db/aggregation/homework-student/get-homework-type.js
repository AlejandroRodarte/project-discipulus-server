const { db } = require('../../../shared');

const getHomeworkType = _id => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: db.names.homework.collectionName,
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
