import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

function wrapText(text, font, fontSize, maxWidth) {
  const words = text.split(" ");
  let line = "";
  const lines = [];

  for (const word of words) {
    const testLine = line + word + " ";
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width > maxWidth) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line.trim());
  return lines;
}

export const generatePDF = async (text) => {
  console.log("generatePDF: text input:", text);

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const maxWidth = page.getWidth() - 2 * margin;
  const lineHeight = fontSize * 1.5;

  let y = page.getHeight() - margin;

  const paragraphs = text.split("\n");
  for (const para of paragraphs) {
    const lines = wrapText(para, font, fontSize, maxWidth);
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = page.getHeight() - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    }
    y -= lineHeight; // extra space after paragraph
  }

  const pdfBytes = await pdfDoc.save();
  console.log("generatePDF: PDF file ready, saving...");
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "cover_letter.pdf");
};
