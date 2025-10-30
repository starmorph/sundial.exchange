/**
 * Type definitions for RAG system
 */

export interface PDFData {
  fileName: string
  text: string
  chunks: string[]
  processedAt: string
}

export interface Embedding {
  id: string
  text: string
  embedding: number[]
  metadata: {
    chunkIndex: number
    fileName: string
  }
}

export interface RetrievalResult {
  text: string
  score: number
  metadata: {
    chunkIndex: number
    fileName: string
  }
}

export interface RAGDocument {
  id: string
  fileName: string
  uploadedAt: string
  chunks: string[]
  embeddings: Embedding[]
}
