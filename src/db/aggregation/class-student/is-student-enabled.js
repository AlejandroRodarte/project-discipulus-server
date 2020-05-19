const isStudentEnabled = (classStudentId) => [
    {
        $match: {
            _id: classStudentId
        }
    },
    {
        $lookup: {
            from: shared.db.names.user.collectionName,
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