const testForValidModel = (model) => {
    const validationError = model.validateSync();
    expect(validationError).not.toBeDefined();
};

module.exports = testForValidModel;
