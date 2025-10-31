"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, Loader2, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { toast } from "sonner"

interface PDFUploadProps {
  onUploadComplete?: (documentId: string, fileName: string) => void
}

export function PDFUpload({ onUploadComplete }: PDFUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    name: string
    documentId: string
  } | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      const pdfFile = files.find((f) => f.type === "application/pdf")

      if (!pdfFile) {
        toast.error("Please upload a PDF file")
        return
      }

      await uploadFile(pdfFile)
    },
    []
  )

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        await uploadFile(file)
      }
    },
    []
  )

  const uploadFile = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/rag/process-pdf", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setUploadedFile({
        name: data.fileName,
        documentId: data.documentId,
      })

      toast.success(`PDF uploaded: ${data.chunkCount} chunks processed`)
      onUploadComplete?.(data.documentId, data.fileName)
    } catch (error) {
      console.error("[PDFUpload] Error:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to upload PDF"
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setUploadedFile(null)
  }

  return (
    <div className="space-y-3">
      {!uploadedFile ? (
        <Card
          className={cn(
            "relative overflow-hidden border-2 border-dashed transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-card hover:bg-accent/5"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="flex cursor-pointer flex-col items-center justify-center px-6 py-8">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
            />

            {isUploading ? (
              <>
                <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Processing PDF...
                </p>
                <p className="text-xs text-muted-foreground">
                  Extracting text and generating embeddings
                </p>
              </>
            ) : (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="mb-1 text-sm font-medium text-foreground">
                  Drop PDF here or click to upload
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF will be processed for AI context
                </p>
              </>
            )}
          </label>
        </Card>
      ) : (
        <Card className="border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ready for AI queries
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
