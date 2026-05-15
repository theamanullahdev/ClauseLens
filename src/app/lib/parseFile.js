"use client";

import { extractTextFromFile } from "@/utils/extractText";

export async function parseFile(file) {
  const result = await extractTextFromFile(file);
  return result;
}

export async function parseMultipleFiles(files) {
  const results = [];
  for (const file of files) {
    const result = await parseFile(file);
    results.push({
      filename: file.name,
      text: result.text,
      error: result.error,
    });
  }
  return results;
}
