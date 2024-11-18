const fs = require("fs");
const { convertMarkdownToHtml } = require("./markdownConverter");

var currentFilePath;
var convertedContent;

function handleError(message, err) {
  console.error(`${message}:`, err.message);
}

function buildFilePath(directory, type, fileName) {
  return path.join(__dirname, directory, type, fileName);
}

function includePartial(partialName) {
  const partialFilePath = buildFilePath("partials", "", partialName + ".md");
  if (fs.existsSync(partialFilePath)) {
    return fs.readFileSync(partialFilePath, "utf8");
  } else {
    handleError(`Partial not found: ${partialName}`, new Error("File not found"));
    return "";
  }
}

function processMarkdownFiles(directory) {
  fs.readdir(__dirname + "/" + directory + "/content", (err, files) => {
    files.forEach((f) => {
      currentFilePath = contentDir + f;
      generateHtmlFromMarkdownFile();
    });
  });
}

async function generateHtmlFromMarkdownFile() {
  let markdownContent = fs.readFileSync(currentFilePath, "utf8");

  convertMarkdownToHtml(markdownContent).then((htmlContent) => {
    convertedContent = htmlContent;
    const htmlFilePath = currentFilePath
      .replace("content", "dist")
      .replace(".md", ".html");

    console.log("HTML file written: " + htmlFilePath);
    fs.writeFileSync(htmlFilePath, convertedContent, "utf8");
  });
}

processMarkdownFiles("blog");