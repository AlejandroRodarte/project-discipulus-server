const testForValidModelField = (model) => {
    const validationError = model.validateSync();
    expect(validationError).not.toBeDefined();
};

module.exports = testForValidModelField;
