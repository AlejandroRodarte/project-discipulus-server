const marked = require('marked');

const dompurify = require('./dompurify');

const parseMarkdownToHtml = (markdown) => {
    return dompurify.sanitize(marked(markdown));
};

module.exports = parseMarkdownToHtml;
