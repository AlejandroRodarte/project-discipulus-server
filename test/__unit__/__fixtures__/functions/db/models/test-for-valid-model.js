const expect = require('chai').expect;

const testForValidModel = (model) => {
    const validationError = model.validateSync();
    expect(validationError).to.be.undefined;
};

module.exports = testForValidModel;
