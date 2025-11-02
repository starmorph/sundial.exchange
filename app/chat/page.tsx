"use client"
import { SundialChatInterface } from "@/components/chat/chat-interface"
import { Navbar } from "@/components/navbar"

export default function SundialPage() {
    return (

        <div className="sundial-theme flex h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1 overflow-hidden">
                <SundialChatInterface />
            </main>
        </div>

    )
}
