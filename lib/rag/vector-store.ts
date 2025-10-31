import type { Embedding, RAGDocument, RetrievalResult } from "./types"

/**
 * In-memory vector store for RAG
 * Stores embeddings and provides similarity search
 */

class VectorStore {
  private documents: Map<string, RAGDocument> = new Map()

  /**
   * Add a document with embeddings to the store
   */
  addDocument(document: RAGDocument): void {
    this.documents.set(document.id, document)
  }

  /**
   * Get a document by ID
   */
  getDocument(id: string): RAGDocument | undefined {
    return this.documents.get(id)
  }

  /**
   * Get all documents
   */
  getAllDocuments(): RAGDocument[] {
    return Array.from(this.documents.values())
  }

  /**
   * Remove a document
   */
  removeDocument(id: string): boolean {
    return this.documents.delete(id)
  }

  /**
   * Clear all documents
   */
  clear(): void {
    this.documents.clear()
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have same length")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)

    if (denominator === 0) {
      return 0
    }

    return dotProduct / denominator
  }

  /**
   * Search for similar chunks across all documents
   */
  search(
    queryEmbedding: number[],
    topK: number = 5,
    documentId?: string
  ): RetrievalResult[] {
    const results: RetrievalResult[] = []

    // Get documents to search
    const documentsToSearch = documentId
      ? [this.documents.get(documentId)].filter(Boolean) as RAGDocument[]
      : Array.from(this.documents.values())

    // Calculate similarity for all embeddings
    for (const doc of documentsToSearch) {
      for (const embedding of doc.embeddings) {
        const score = this.cosineSimilarity(queryEmbedding, embedding.embedding)
        results.push({
          text: embedding.text,
          score,
          metadata: embedding.metadata,
        })
      }
    }

    // Sort by score (descending) and return top K
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }

  /**
   * Get statistics about the store
   */
  getStats() {
    const totalDocs = this.documents.size
    const totalChunks = Array.from(this.documents.values()).reduce(
      (sum, doc) => sum + doc.embeddings.length,
      0
    )

    return {
      totalDocuments: totalDocs,
      totalChunks,
      documents: this.getAllDocuments().map((doc) => ({
        id: doc.id,
        fileName: doc.fileName,
        uploadedAt: doc.uploadedAt,
        chunkCount: doc.chunks.length,
      })),
    }
  }
}

// Singleton instance
export const vectorStore = new VectorStore()

/**
 * Generate embeddings using OpenAI API
 */
export async function generateEmbeddings(
  texts: string[],
  apiKey: string
): Promise<number[][]> {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: texts,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data.map((item: any) => item.embedding)
  } catch (error) {
    console.error("[Embeddings] Error:", error)
    throw new Error("Failed to generate embeddings")
  }
}

/**
 * Add a document to the vector store with embeddings
 */
export async function addDocumentWithEmbeddings(
  id: string,
  fileName: string,
  chunks: string[],
  apiKey: string
): Promise<RAGDocument> {
  // Generate embeddings for all chunks
  const embeddings = await generateEmbeddings(chunks, apiKey)

  // Create embedding objects
  const embeddingObjects: Embedding[] = chunks.map((text, index) => ({
    id: `${id}-chunk-${index}`,
    text,
    embedding: embeddings[index],
    metadata: {
      chunkIndex: index,
      fileName,
    },
  }))

  // Create document
  const document: RAGDocument = {
    id,
    fileName,
    uploadedAt: new Date().toISOString(),
    chunks,
    embeddings: embeddingObjects,
  }

  // Add to store
  vectorStore.addDocument(document)

  return document
}

/**
 * Retrieve relevant context for a query
 */
export async function retrieveContext(
  query: string,
  apiKey: string,
  topK: number = 5,
  documentId?: string
): Promise<RetrievalResult[]> {
  // Generate embedding for the query
  const [queryEmbedding] = await generateEmbeddings([query], apiKey)

  // Search vector store
  return vectorStore.search(queryEmbedding, topK, documentId)
}
