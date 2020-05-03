const db = require('../db');
const storage = require('../storage');

const teardown = (persistedContext) => async () => {
    await db.teardown(persistedContext.db)();
    await storage.teardown(persistedContext.storage)();
};

module.exports = teardown;