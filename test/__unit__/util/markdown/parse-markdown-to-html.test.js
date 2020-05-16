const expect = require('chai').expect;

const markdownUtils = require('../../../../src/util/markdown');

describe('[util/markdown/parse-markdown-to-html] - general flow', () => {

    it('Should parse markdown string to html', () => {

        const markdown = '## This is some dope markdown';
        const html = markdownUtils.parseMarkdownToHtml(markdown);

        expect(html).to.include('<h2');
        expect(html).to.include('</h2>');

    });

});
