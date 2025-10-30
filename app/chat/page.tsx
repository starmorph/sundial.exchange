"use client"
import { Navbar } from "@/components/navbar"
import { RAGChatInterface } from "@/components/rag/rag-chat-interface"
import { RAGProvider } from "@/components/rag/rag-provider"
import { SundialChatInterface } from "@/components/sundial-chat/chat-interface"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SundialPage() {
    return (
        <div className="sundial-theme flex h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1 overflow-hidden">
                <RAGProvider>
                    <Tabs defaultValue="chat" className="h-full flex flex-col">
                        <div className="shrink-0 border-b border-border px-4">
                            <TabsList className="bg-transparent">
                                <TabsTrigger value="chat">Standard Chat</TabsTrigger>
                                <TabsTrigger value="rag">PDF Chat (RAG)</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
                            <SundialChatInterface />
                        </TabsContent>
                        <TabsContent value="rag" className="flex-1 overflow-hidden m-0">
                            <RAGChatInterface />
                        </TabsContent>
                    </Tabs>
                </RAGProvider>
            </main>
        </div>
    )
}
