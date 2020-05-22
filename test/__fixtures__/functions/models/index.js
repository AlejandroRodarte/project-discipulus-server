const testForInvalidModel = require('./test-for-invalid-model');
const testForValidModel = require('./test-for-valid-model');
const testForInvalidModelAsync = require('./test-for-invalid-model-async');
const testForValidModelAsync = require('./test-for-valid-model-async'); 
const getNewModelInstance = require('./get-new-model-instance');
const validateAsync = require('./validate-async');
const generateFakeUsers = require('./generate-fake-users');
const generateFakeFile = require('./generate-fake-file');
const generateFakeEvent = require('./generate-fake-event');
const generateFakeClass = require('./generate-fake-class');
const generateFakeNote = require('./generate-fake-note');
const generateFakeImageFile = require('./generate-fake-image-file');
const generateFakeSession = require('./generate-fake-session');
const generateFakeHomework = require('./generate-fake-homework');
const generateFakeHomeworkSection = require('./generate-fake-homework-section');
const setup = require('./setup');

module.exports = {
    testForInvalidModel,
    testForValidModel,
    testForInvalidModelAsync,
    testForValidModelAsync,
    getNewModelInstance,
    validateAsync,
    generateFakeUsers,
    generateFakeFile,
    generateFakeEvent,
    generateFakeClass,
    generateFakeNote,
    generateFakeImageFile,
    generateFakeSession,
    generateFakeHomework,
    generateFakeHomeworkSection,
    setup
};
