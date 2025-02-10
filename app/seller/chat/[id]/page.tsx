'use client'

import { useUser } from "@/contexts/userContext"
import ChatScreen from "./chat"
import { useAuth } from "@/contexts/AuthContext"

export default function ChatWith ({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const { profile: sender } = useUser(user?.uid ?? '')
    const { profile: receiver } = useUser(params.id)

    if (sender && receiver)
    return (
        <>
            <ChatScreen receiver={receiver} sender={sender}/>
        </>
    )
}