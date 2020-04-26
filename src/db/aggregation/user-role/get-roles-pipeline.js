const { role } = require('../../names');

const getRolesPipeline = (userId) => [
    {
        $match: {
            user: userId
        }
    },
    {
        $lookup: {
            from: role.collectionName,
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
