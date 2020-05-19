const { db } = require('../../../shared');

const getEnabledClassStudentIds = (classId) => [
    {
        $match: {
            class: classId
        }
    },
    {
        $lookup: {
            from: db.names.user.collectionName,
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
                $push: '$user._id'
            }
        }
    }
];

module.exports = getEnabledClassStudentIds;
