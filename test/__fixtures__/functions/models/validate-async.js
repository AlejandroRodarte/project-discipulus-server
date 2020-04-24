const validateAsync = (model) => new Promise(resolve => model.validate(resolve));

module.exports = validateAsync;
