import { Chat } from "@/models/chatMessage";
import { formatRelativeDate } from "@/scripts/relative-date";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ChatList: React.FC<{ chats: Chat[], userId: string }> = ({ chats, userId }) => {
    const router = useRouter();
    const handleChatClick = (chatId: string) => {
        router.push(`/seller/chat/${chatId}`);
    };
    useEffect(() => {
        console.log(chats);
        
    }, [chats])
    return (
        <div className="flex md:hidden flex-col w-full gap-4">
            {chats.length > 0 && chats.map((chat, index) => (
                <button
                    onClick={() => handleChatClick(userId + '_' + chat.chatWith.userId)}
                    key={index}
                    className="flex w-full items-center justify-between p-4 bg-white border-b border-gray-200 rounded-md shadow-sm"
                >
                    <div className="flex items-center">
                        <Image
                            src={chat.chatWith.photo}
                            alt={chat.chatWith.name}
                            width={50}
                            height={50}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div className="flex-1 text-start">
                            <p className="font-semibold text-sm">{chat.chatWith.name}</p>
                            <p className="text-xs text-gray-500">
                                {chat.lastMessage?.senderId !== chat.chatWith.userId
                                    ? `You: ${chat.lastMessage?.text}`
                                    : chat.lastMessage.text}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        <p className="text-xs text-gray-400">
                            {formatRelativeDate(chat.lastMessage?.createdAt ?? '')}
                        </p>
                        {chat.unreadMessagesCount > 0 && (
                            <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                {chat.unreadMessagesCount}
                            </div>
                        )}
                    </div>
                </button>
            ))}
            {chats.length === 0 && (
                <div className="w-full h-full flex-1 flex flex-col justify-center gap-4 items-center">
                    <small className="text-gray-400 text-center">Você não possuí nenhum chat ainda! <br /> Os clientes irão entrar em contacto consigo quando tiver publicado seus produtos. </small>
                    <Image
                        src="/images/no-message.png"
                        alt="no notification found!"
                        width={300}
                        height={300}
                    />
                </div>
            )}
        </div>
    )
}