const testForInvalidModelField = (model, fieldOption) => {

    const validationError = model.validateSync();
    const [, validationMessage] = fieldOption;

    expect(validationError).toBeDefined();
    expect(validationError.message.includes(validationMessage)).toBe(true);

};

module.exports = testForInvalidModelField;
