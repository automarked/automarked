'use client'

import { useUser } from "@/contexts/userContext"
import ChatScreen from "./chat"

export default function ChatWith ({ params }: { params: { id: string } }) {
    const [senderId, receiverId] = params.id.split('_')
    const { profile: sender } = useUser(senderId ?? '')
    const { profile: receiver } = useUser(receiverId ?? '')

    if (sender && receiver)
    return (
        <>
            <ChatScreen receiver={receiver} sender={sender}/>
        </>
    )
}