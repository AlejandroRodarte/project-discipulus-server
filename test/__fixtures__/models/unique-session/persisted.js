const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const classes = util.generateOneToMany('user', new Types.ObjectId(), [ models.generateFakeClass() ]);

const sessions = util.generateOneToMany('class', classes[0]._id, [ models.generateFakeSession() ]);

module.exports = {
    [db.names.class.modelName]: classes,
    [db.names.session.modelName]: sessions
};
