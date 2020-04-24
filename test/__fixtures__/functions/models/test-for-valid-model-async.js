const expect = require('chai').expect;

const validateAsync = require('./validate-async');

const testForValidModelAsync = async (model) => {
    const validationError = await validateAsync(model);
    expect(validationError).to.be.null;
};

module.exports = testForValidModelAsync;
