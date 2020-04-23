const expect = require('chai').expect;

const testForInvalidModel = (model, fieldOption) => {

    const validationError = model.validateSync();
    const [, validationMessage] = fieldOption;

    expect(validationError).to.be.an('object');
    expect(validationError.message.includes(validationMessage)).to.equal(true);

};

module.exports = testForInvalidModel;
