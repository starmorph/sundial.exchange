import { vectorStore } from "@/lib/rag/vector-store"

/**
 * API route for managing documents
 * GET: List all documents
 * DELETE: Remove a document
 */
export async function GET() {
  try {
    const stats = vectorStore.getStats()
    return new Response(JSON.stringify(stats), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[RAG] Get documents error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to get documents" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return new Response(
        JSON.stringify({ error: "Document ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    }

    const success = vectorStore.removeDocument(documentId)

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Document not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("[RAG] Delete document error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to delete document" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
