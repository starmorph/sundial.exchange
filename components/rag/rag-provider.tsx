"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface DocumentInfo {
  id: string
  fileName: string
  uploadedAt: string
  chunkCount: number
}

interface RAGContextValue {
  activeDocumentId: string | null
  documents: DocumentInfo[]
  isLoading: boolean
  setActiveDocument: (id: string | null) => void
  addDocument: (id: string, fileName: string) => void
  refreshDocuments: () => Promise<void>
}

const RAGContext = createContext<RAGContextValue | undefined>(undefined)

export function RAGProvider({ children }: { children: React.ReactNode }) {
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/rag/documents")
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("[RAG] Failed to refresh documents:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addDocument = (id: string, fileName: string) => {
    const newDoc: DocumentInfo = {
      id,
      fileName,
      uploadedAt: new Date().toISOString(),
      chunkCount: 0,
    }
    setDocuments((prev) => [...prev, newDoc])
    setActiveDocumentId(id)
    // Refresh to get accurate chunk count
    refreshDocuments()
  }

  const setActiveDocument = (id: string | null) => {
    setActiveDocumentId(id)
  }

  // Load documents on mount
  useEffect(() => {
    refreshDocuments()
  }, [])

  return (
    <RAGContext.Provider
      value={{
        activeDocumentId,
        documents,
        isLoading,
        setActiveDocument,
        addDocument,
        refreshDocuments,
      }}
    >
      {children}
    </RAGContext.Provider>
  )
}

export function useRAG() {
  const context = useContext(RAGContext)
  if (context === undefined) {
    throw new Error("useRAG must be used within a RAGProvider")
  }
  return context
}
