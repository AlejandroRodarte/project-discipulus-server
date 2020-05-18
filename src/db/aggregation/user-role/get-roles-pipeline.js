const { db } = require('../../../shared');

const getRolesPipeline = (userId) => [
    {
        $match: {
            user: userId
        }
    },
    {
        $lookup: {
            from: db.names.role.collectionName,
            localField: 'role',
            foreignField: '_id',
            as: 'role'
        }
    },
    {
        $unwind: '$role'
    },
    {
        $group: {
            _id: '$user',
            roles: {
                $push: '$role.name'
            }
        }
    }
];

module.exports = getRolesPipeline;
