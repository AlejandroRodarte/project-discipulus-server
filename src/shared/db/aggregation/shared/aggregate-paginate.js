const aggregatePaginate = ({
    match = {},
    middle = {
        include: false,
        pipeline: []
    },
    sort = {
        baseField: true,
        pipeline: [],
        params: {
            fieldName: '_id',
            order: 1
        }
    },
    page = 1,
    limit = 1,
    pipeline = []
}) => {

    const paginationPipeline = [];

    // apply initial matching criteria to the pipeline
    paginationPipeline.push(
        {
            $match: match
        }
    );

    // if a middleware pipeline is required (for example to join other collections before paginating)
    // then include it in the main pipeline
    if (middle.include) {
        paginationPipeline.push(
            ...middle.pipeline
        );
    }

    // if sorting will NOT be based on a regular field located at the root collection, then include
    // the pipeline that guarantees that the information to sort by is included
    if (!sort.baseField) {
        paginationPipeline.push(
            ...sort.pipeline
        );
    }

    // apply sorting based on field name and order criteria
    paginationPipeline.push(
        {
            $sort: {
                [sort.params.fieldName]: sort.params.order
            }
        }
    );

    // apply facet that includes pagination metadata and the actual matched/sorted docs
    paginationPipeline.push(
        {
            $facet: {
                metadata: [
                    {
                        $count: 'totalDocs'
                    },
                    {
                        $addFields: {
                            limit: limit,
                            totalPages: {
                                $ceil: {
                                    $divide: [
                                        '$totalDocs',
                                        limit
                                    ]
                                }
                            },
                            page: page
                        }
                    },
                    {
                        $addFields: {
                            hasPrevPage: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$page',
                                            page
                                        ]
                                    },
                                    false,
                                    true
                                ]
                            },
                            hasNextPage: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$page',
                                            '$totalPages'
                                        ]
                                    },
                                    false,
                                    true
                                ]
                            },
                            prevPage: {
                                $cond: [
                                    {
                                        $eq: [
                                            '$page',
                                            page
                                        ]
                                    },
                                    null,
                                    {
                                        $subtract: [
                                            '$page',
                                            1
                                        ]
                                    }
                                ]
                            },
                            nextPage: {
                                $cond: [
                                    {
                                        $gte: [
                                            '$page',
                                            '$totalPages'
                                        ]
                                    },
                                    null,
                                    {
                                        $add: [
                                            '$page',
                                            1
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                docs: [

                    // skip/limit docs
                    {
                        $skip: (page - 1) * limit
                    },
                    {
                        $limit: limit
                    },

                    // apply pipeline to the paginated documents
                    ...pipeline

                ]
            }
        }
    );

    return paginationPipeline;

};



module.exports = aggregatePaginate;
