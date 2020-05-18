const expect = require('chai').expect;

const { markdown } = require('../../../../src/util');

describe('[util/markdown/parse-markdown-to-html] - general flow', () => {

    it('Should parse markdown string to html', () => {

        const markdownText = '## This is some dope markdown';
        const html = markdown.parseMarkdownToHtml(markdownText);

        expect(html).to.include('<h2');
        expect(html).to.include('</h2>');

    });

});
