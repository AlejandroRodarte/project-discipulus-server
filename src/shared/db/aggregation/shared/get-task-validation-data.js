const getTaskValidationData = (_id, { child, grandChild }) => [
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
                        from: grandChild.collectionName,
                        let: {
                            grandChildId: `$${ grandChild.ref }`
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$_id',
                                            '$$grandChildId'
                                        ]
                                    }
                                }
                            }
                        ],
                        as: grandChild.ref
                    }
                },
                {
                    $unwind: `$${ grandChild.ref }`
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
            forced: `$${ child.ref }.forced`,
            end: {
                $ifNull: [ `$${ child.ref }.${ grandChild.ref }.timeRange.end`, undefined ]
            }
        }
    }
];

module.exports = getTaskValidationData;
