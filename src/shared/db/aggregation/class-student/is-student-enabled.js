const { user } = require('../../names');

const isStudentEnabled = (classStudentId) => [
    {
        $match: {
            _id: classStudentId
        }
    },
    {
        $lookup: {
            from: user.collectionName,
            localField: 'user',
            foreignField: '_id',
            as: 'user'
        }
    },
    {
        $unwind: '$user'
    },
    {
        $project: {
            enabled: '$user.enabled'
        }
    }
];

module.exports = isStudentEnabled;
