// src/app/utils/extractText.js

import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// set the PDF worker (browser-safe)
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export async function extractTextFromFile(file) {
  const type = file.type;
  const isPDF = type === "application/pdf";
  const isDOCX =
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (!isPDF && !isDOCX) {
    return {
      text: "",
      error: "Unsupported file format. Only PDF and DOCX are supported.",
    };
  }

  try {
    const buffer = await file.arrayBuffer();

    if (isPDF) {
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        console.log(`📄 Page ${i} raw content:\n`, JSON.stringify(content, null, 2));

        const strings = content.items.map((item) => item.str).join(" ");
        fullText += strings + "\n";
      }

      if (!fullText.trim()) {
        return {
          text: "",
          error:
            "Parsing succeeded but no readable text was found in the PDF. It may contain scanned images or protected layers.",
        };
      }

      console.log("✅ Full extracted PDF text:\n", fullText.trim());

      return { text: fullText.trim(), error: null };
    }

    if (isDOCX) {
      const result = await mammoth.extractRawText({ arrayBuffer: buffer });

      console.log("✅ Full extracted DOCX result:\n", JSON.stringify(result, null, 2));

      if (!result.value.trim()) {
        return {
          text: "",
          error:
            "DOCX parsed but no text was extracted. File might be encrypted or empty.",
        };
      }

      console.log("✅ DOCX raw text:\n", result.value.trim());

      return { text: result.value.trim(), error: null };
    }

    return { text: "", error: "Unhandled file type." };
  } catch (err) {
    console.error("❌ Parsing error:\n", err);
    return {
      text: "",
      error:
        "An unexpected error occurred while parsing the file. Try pasting your CV instead.",
    };
  }
}
