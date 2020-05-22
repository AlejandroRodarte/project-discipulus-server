const getTaskValidationData = (_id, { child, grandChildOne, grandChildTwo }) => [
    {
        $match: { _id }
    },
    {
        $lookup: {
            from: child.collectionName,
            let: {
                childId: `$${ child.ref }`
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: [
                                '$_id',
                                '$$childId'
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: grandChildOne.collectionName,
                        let: {
                            grandChildOneId: `$${ grandChildOne.ref }`
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$grandChildOneId'
                                        ]
                                    }
                                }
                            }
                        ],
                        as: grandChildOne.ref
                    }
                },
                {
                    $unwind: `$${ grandChildOne.ref }`
                },
                {
                    $lookup: {
                        from: grandChildTwo.collectionName,
                        let: {
                            grandChildTwoId: `$${ grandChildTwo.ref }`
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$grandChildTwoId'
                                        ]
                                    }
                                }
                            }
                        ],
                        as: grandChildTwo.ref
                    }
                },
                {
                    $unwind: `$${ grandChildTwo.ref }`
                }
            ],
            as: child.ref
        }
    },
    {
        $unwind: `$${ child.ref }`
    },
    {
        $project: {
            completed: `$${ child.ref }.completed`,
            forced: `$${ child.ref }.${ grandChildOne.ref }.${ grandChildOne.forcedFlagRef }`,
            end: {
                $ifNull: [ `$${ child.ref }.${ grandChildTwo.ref }.timeRange.end`, undefined ]
            }
        }
    }
];

module.exports = getTaskValidationData;
