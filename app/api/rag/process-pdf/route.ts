import { processPDF } from "@/lib/rag/pdf-processor"
import { addDocumentWithEmbeddings } from "@/lib/rag/vector-store"
import { nanoid } from "nanoid"

/**
 * API route for processing PDF files
 * Extracts text, chunks it, generates embeddings, and stores in vector store
 */
export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OPENAI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    // Parse form data
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "File must be a PDF" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Process PDF
    const pdfData = await processPDF(buffer, file.name)

    // Generate document ID
    const documentId = nanoid()

    // Add to vector store with embeddings
    const document = await addDocumentWithEmbeddings(
      documentId,
      file.name,
      pdfData.chunks,
      apiKey
    )

    return new Response(
      JSON.stringify({
        success: true,
        documentId: document.id,
        fileName: document.fileName,
        chunkCount: document.chunks.length,
        uploadedAt: document.uploadedAt,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("[RAG] Process PDF error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
