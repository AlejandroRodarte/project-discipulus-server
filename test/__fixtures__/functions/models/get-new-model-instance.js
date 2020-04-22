const getNewModelInstance = (Model, doc) => () => new Model(doc);

module.exports = getNewModelInstance;
