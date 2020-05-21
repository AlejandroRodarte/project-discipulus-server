const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedClasses = persisted[db.names.class.modelName];
const persistedSessions = persisted[db.names.session.modelName];
