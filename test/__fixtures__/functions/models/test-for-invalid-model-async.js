const expect = require('chai').expect;

const validateAsync = require('./validate-async');

const testForInvalidModelAsync = async (model, fieldOption) => {

    const validationError = await validateAsync(model);
    const [, validationMessage] = fieldOption;

    expect(validationError).to.be.an('object');
    expect(validationError.message.includes(validationMessage)).to.equal(true);

};

module.exports = testForInvalidModelAsync;
