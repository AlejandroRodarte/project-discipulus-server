const { user } = require('../../names');

const getEnabledClassStudentIds = (classId) => [
    {
        $match: {
            class: classId
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
        $match: {
            'user.enabled': true
        }
    },
    {
        $group: {
            _id: '$class',
            studentIds: {
                $push: '$_id'
            }
        }
    }
];

module.exports = getEnabledClassStudentIds;
