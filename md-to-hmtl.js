const fs = require('fs');
const path = require('path');
const { convertMarkdownToHtml } = require('./markdownConverter');
const winston = require('winston'); // Added for better logging

// Configuration
const CONFIG = {
  directories: {
    source: 'content',
    output: 'dist',
    partials: 'partials'
  },
  extensions: {
    markdown: '.md',
    html: '.html'
  },
  encoding: 'utf8'
};

// Setup logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' })
  ]
});

/**
 * Handles errors uniformly across the application
 * @param {string} message - Error message
 * @param {Error} err - Error object
 */
function handleError(message, err) {
  logger.error(`${message}: ${err.message}`, { error: err });
  throw err;
}

/**
 * Builds a file path using platform-specific separators
 * @param {string} directory - Base directory
 * @param {string} type - Subdirectory type
 * @param {string} fileName - Name of the file
 * @returns {string} Complete file path
 */
function buildFilePath(directory, type, fileName) {
  return path.join(__dirname, directory, type, fileName);
}

/**
 * Includes and processes partial markdown files
 * @param {string} partialName - Name of the partial file
 * @returns {string} Content of the partial file
 */
async function includePartial(partialName) {
  const partialFilePath = buildFilePath(
    CONFIG.directories.partials,
    '',
    `${partialName}${CONFIG.extensions.markdown}`
  );

  try {
    const exists = await fs.promises.access(partialFilePath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      throw new Error(`Partial not found: ${partialName}`);
    }

    return await fs.promises.readFile(partialFilePath, CONFIG.encoding);
  } catch (err) {
    handleError(`Error processing partial: ${partialName}`, err);
    return '';
  }
}

/**
 * Processes markdown content to HTML
 * @param {string} filePath - Path to markdown file
 * @returns {Promise<string>} Generated HTML content
 */
async function generateHtmlFromMarkdownFile(filePath) {
  try {
    const markdownContent = await fs.promises.readFile(filePath, CONFIG.encoding);
    const htmlContent = await convertMarkdownToHtml(markdownContent);
    const htmlFilePath = filePath
      .replace(CONFIG.directories.source, CONFIG.directories.output)
      .replace(CONFIG.extensions.markdown, CONFIG.extensions.html);

    await fs.promises.mkdir(path.dirname(htmlFilePath), { recursive: true });
    await fs.promises.writeFile(htmlFilePath, htmlContent, CONFIG.encoding);
    logger.info(`HTML file written: ${htmlFilePath}`);
    return htmlContent;
  } catch (err) {
    handleError(`Error generating HTML from ${filePath}`, err);
  }
}

/**
 * Main function to process all markdown files in a directory
 * @param {string} directory - Directory containing markdown files
 */
async function processMarkdownFiles(directory) {
  try {
    const contentPath = buildFilePath(directory, CONFIG.directories.source, '');
    const files = await fs.promises.readdir(contentPath);
    await Promise.all(
      files
        .filter(file => file.endsWith(CONFIG.extensions.markdown))
        .map(file => generateHtmlFromMarkdownFile(path.join(contentPath, file)))
    );

    logger.info(`Processed ${files.length} markdown files`);
  } catch (err) {
    handleError('Failed to process markdown files', err);
  }
}

// Execute the processing
(async () => {
  try {
    await processMarkdownFiles('blog');
  } catch (err) {
    logger.error('Failed to execute markdown processing', { error: err });
    process.exit(1);
  }
})();
