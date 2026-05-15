import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export const generateDOCX = async (text) => {
  console.log("generateDOCX: text input:", text);

  const paragraphs = text.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            font: "Calibri",
            size: 24,
          }),
        ],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  console.log("generateDOCX: DOCX file ready, saving...");
  saveAs(blob, "cover_letter.docx");
};
