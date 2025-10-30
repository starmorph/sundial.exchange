import type { PDFData } from "./types"

/**
 * PDF Processing utilities for RAG
 * Handles PDF parsing, text extraction, and chunking
 */

/**
 * Extract text from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid bundling issues
    const pdfParse = (await import("pdf-parse")).default
    const data = await pdfParse(buffer)
    return data.text
  } catch (error) {
    console.error("[PDF] Error extracting text:", error)
    throw new Error("Failed to extract text from PDF")
  }
}

/**
 * Split text into chunks for embedding
 * Uses a simple sliding window approach with overlap
 */
export function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): string[] {
  const chunks: string[] = []

  // Clean and normalize text
  const cleanText = text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, "\n")
    .trim()

  if (cleanText.length <= chunkSize) {
    return [cleanText]
  }

  let startIndex = 0

  while (startIndex < cleanText.length) {
    const endIndex = Math.min(startIndex + chunkSize, cleanText.length)
    const chunk = cleanText.slice(startIndex, endIndex)

    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim())
    }

    // Move forward by chunkSize - overlap
    startIndex += chunkSize - overlap
  }

  return chunks
}

/**
 * Process PDF file: extract text and chunk it
 */
export async function processPDF(
  buffer: Buffer,
  fileName: string
): Promise<PDFData> {
  const text = await extractTextFromPDF(buffer)
  const chunks = chunkText(text)

  return {
    fileName,
    text,
    chunks,
    processedAt: new Date().toISOString(),
  }
}
