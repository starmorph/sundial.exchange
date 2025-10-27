"use client"
import { Navbar } from "@/components/navbar"
import { SundialChatInterface } from "@/components/sundial-chat/chat-interface"

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
