const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const extractResumeText = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error("Resume file path is required");
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`Resume file not found: ${filePath}`);
    }

    const pdfBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    return pdfData.text.trim();
  } catch (error) {
    throw new Error(
      `Failed to extract resume text: ${error.message}`
    );
  }
};

module.exports = {
  extractResumeText,
};