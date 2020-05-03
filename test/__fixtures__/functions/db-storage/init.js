const db = require('../db');
const storage = require('../storage');

const init = (persistedContext) => async () => {
    await db.init(persistedContext.db)();
    await storage.init(persistedContext.storage)();
};

module.exports = init;
