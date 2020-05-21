const { Types } = require('mongoose');

const { models, util } = require('../../functions');

const { db } = require('../../../../src/shared');

const persisted = require('./persisted');

const persistedSessions = persisted[db.names.session.modelName];
const persistedSessionNotes = persisted[db.names.sessionNote.modelName];

const sessionNotes = [

    // 0. unknown session with note
    ...util.generateOneToMany('session', new Types.ObjectId(), [{ note: models.generateFakeNote() }]),

    ...util.generateOneToMany('session', persistedSessions[0]._id, [

        // 1. session[0] with note that has same title as sessionNote[0] associated to session[0]
        {
            note: {
                ...models.generateFakeNote(),
                title: persistedSessionNotes[0].note.title
            }
        },

        // 2. session[0] with unique note
        { note: models.generateFakeNote() }

    ])

];

module.exports = {
    [db.names.sessionNote.modelName]: sessionNotes
};
