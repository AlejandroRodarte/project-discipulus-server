const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const sessions = [
    // 0: sample session
    ...util.generateOneToMany('class', new Types.ObjectId(), [ models.generateFakeSession() ])
];

const sessionNotes = [
    // 0-1: session[0] with two notes
    ...util.generateOneToMany('session', sessions[0]._id, [{ note: models.generateFakeNote() }, { note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.session.modelName]: sessions,
    [db.names.sessionNote.modelName]: sessionNotes
};
