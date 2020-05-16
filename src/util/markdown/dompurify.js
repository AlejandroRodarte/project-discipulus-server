const { JSDOM } = require('jsdom');
const createDomPurify = require('dompurify');

const dompurify = createDomPurify(new JSDOM().window);

module.exports = dompurify;
