const { classStudent, user } = require('../../../../../names');

module.exports = (userMatch = {}) => [
    {
        $lookup: {
            from: classStudent.collectionName,
            let: {
                classStudentId: '$classStudent'
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                '$_id',
                                '$$classStudentId'
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: user.collectionName,
                        let: {
                            userId: '$user'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$userId'
                                        ]
                                    },
                                    ...userMatch
                                }
                            },
                            {
                                $project: {
                                    name: 1,
                                    username: 1,
                                    avatar: {
                                        _id: 1
                                    }
                                }
                            }
                        ],
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        user: 1
                    }
                }
            ],
            as: 'classStudent'
        }
    },
    {
        $unwind: '$classStudent'
    }
];
