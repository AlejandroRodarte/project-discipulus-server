const { Types } = require('mongoose');
const { db } = require('../../../../src/shared');

const { models, util } = require('../../functions');

const sessions = [
    // 0: generate one sample session
    ...util.generateOneToMany('class', new Types.ObjectId(), [ models.generateFakeSession() ])
];

const sessionNotes = [
    // 0: session[0] with sample note
    ...util.generateOneToMany('session', sessions[0]._id, [{ note: models.generateFakeNote() }])
];

module.exports = {
    [db.names.session.modelName]: sessions,
    [db.names.sessionNote.modelName]: sessionNotes
};
