'use client'

import React, { useEffect, useState } from "react";

import { useUser } from "@/contexts/userContext";
import Image from "next/image";
import ChatSidebar from "@/components/both/chat-sidebar";
import { useNotificationContext } from "@/contexts/notificationContext";
import ChatHeader from "@/components/both/chat-header";
import { Chat } from "@/models/chatMessage";
import MessageInput from "@/components/both/message-input";
import { useChatContext } from "@/contexts/chatContext";

const PersonalChat = () => {

    const { user } = useUser()
    const { unreadMessagesCount } = useNotificationContext()
    const { chats, getAllMessagesOrChats, setReceiverId } = useChatContext()
    const [selectedChat, setSelectedChat] = useState<Chat>()

    useEffect(() => {
        getAllMessagesOrChats()
    }, [unreadMessagesCount])

    useEffect(() => {
        if (selectedChat)
            setReceiverId(selectedChat.chatWith.userId)
    }, [selectedChat])


    return (
        <div className="flex h-screen w-full overflow-hidden">
            <div className="h-full md:w-96 w-full">
                <ChatSidebar setChat={setSelectedChat} chats={chats} user={user} />
            </div>
            <div className="hidden md:block flex-1 h-full">
                <div className="flex flex-col h-full">
                    {selectedChat ? (
                        <>
                            <ChatHeader {...selectedChat} />
                            <div className="flex-1 overflow-hidden">
                                <MessageInput receiverPhoto={selectedChat.chatWith.photo} sendername={selectedChat.chatWith.name} />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col justify-center gap-4 items-center">
                            <small className="text-gray-400 text-center">Suas mensagens aparecerão aqui quando clicar em uma conversa!</small>
                            <Image
                                src="/images/no-message.png"
                                alt="no notification found!"
                                width={300}
                                height={300}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalChat;