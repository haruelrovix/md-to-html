const { marked } = require('marked');

/**
 * Converts Markdown content to HTML
 * @param {string} markdown - The Markdown string to convert
 * @returns {string} The converted HTML string
 */
function convertMarkdownToHtml(markdown) {
    // Configure marked options if needed
    marked.setOptions({
        gfm: true, // Enable GitHub Flavored Markdown
        breaks: true, // Enable line breaks
        sanitize: false, // Use 'marked-html' for sanitation if needed
    });

    return marked(markdown);
}

module.exports = { convertMarkdownToHtml };
