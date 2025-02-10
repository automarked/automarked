import { Chat } from "@/models/chatMessage";
import { formatRelativeDate } from "@/scripts/relative-date";
import { Search, Pin, MessageCircle, Menu, Bell } from "lucide-react";
import { useState } from "react";
import SearchInput from "./input-search";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChatSidebar({ user, chats, setChat }: {
    user: {
        uid: string;
        email: string;
        name: string;
    } | null,
    chats: Chat[],
    setChat: React.Dispatch<React.SetStateAction<Chat | undefined>>
}) {
    const router = useRouter();
    const { toggleSidebar } = useMaterialLayout()
    const { unreadNotifications } = useNotificationContext()
    const [search, setSearch] = useState('')

    const handleChatClick = (chatId: string) => {
        router.push(`/seller/chat/${chatId}`);
    };
    
    return (
        <div className="flex flex-col w-full md:max-w-sm h-screen bg-white border-r shadow-sm">
            {/* Search */}
            <div className="flex justify-between items-center">
                <div className="flex justify-between w-full items-end">
                    <div className="px-4 text-lg pt-8 font-bold text-black">
                        Conversas
                    </div>
                    <button onClick={() => toggleSidebar()} className="hidden md:flex mr-4 p-2 rounded-full hover:bg-gray-100">
                        <Menu className='cursor-pointer' size={24} />
                    </button>
                </div>
                <div className="flex md:hidden items-center space-x-4">
                    <div className="relative cursor-pointer" onClick={() => {
                        router.push('/seller/notifications');
                    }}>
                        <Bell />
                        {unreadNotifications.length > 0 && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {unreadNotifications.length}
                            </div>
                        )}
                    </div>
                    <div onClick={() => toggleSidebar()} className="flex items-center gap-2">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <Menu className='cursor-pointer' size={24} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="p-4 border-b">
                <div className="relative">
                    <SearchInput dark value={search} setValue={setSearch} />
                </div>
            </div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                Todas as mensagens
            </div>
            {search.trim() && (
                <strong className="pl-4 py-2 font-bold">{`Resultados para "${search}"`}</strong>
            )}
            <div className="hidden px-4 md:block overflow-y-scroll">
                {!search.trim() ? chats.map((chat, i) => (                    
                    <div
                        onClick={() => setChat(chat)}
                        key={i}
                        className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">                                
                                <Image
                                    width={50}
                                    height={50}
                                    src={chat.chatWith.photo}
                                    alt="User"
                                    className="object-cover rounded-full w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="text-base font-medium">{chat.chatWith.name}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage?.senderId !== chat.chatWith.userId
                                        ? `Você: ${chat.lastMessage?.text.slice(0, 20)}...`
                                        : chat.lastMessage.text.slice(0, 20) + '...'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className="text-xs text-gray-400">
                                {formatRelativeDate(chat.lastMessage?.createdAt ?? '')}
                            </span>
                            {chat.unreadMessagesCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                    {chat.unreadMessagesCount}
                                </div>
                            )}
                        </div>
                    </div>
                )) : chats.filter(chat => `
                    ${chat.chatWith.name} 
                  `.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
                ).map((chat, i) => (
                    <div
                        onClick={() => setChat(chat)}
                        key={i}
                        className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">
                                <Image
                                    width={50}
                                    height={50}
                                    src={chat.chatWith.photo}
                                    alt="User"
                                    className="object-cover rounded-full w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="text-base font-medium">{chat.chatWith.name}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage?.senderId !== chat.chatWith.userId
                                        ? `Você: ${chat.lastMessage?.text.slice(0, 20)}...`
                                        : chat.lastMessage.text.slice(0, 20) + '...'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className="text-xs text-gray-400">
                                {formatRelativeDate(chat.lastMessage?.createdAt ?? '')}
                            </span>
                            {chat.unreadMessagesCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                    {chat.unreadMessagesCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 px-4 md:hidden overflow-y-scroll">
                {!search.trim() ? chats.map((chat, i) => (
                    <div
                        onClick={() => handleChatClick(chat.chatWith.userId)}
                        key={i}
                        className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">
                                <Image
                                    width={50}
                                    height={50}
                                    src={chat.chatWith.photo}
                                    alt="User"
                                    className="object-cover rounded-full w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="text-base font-medium">{chat.chatWith.name}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage?.senderId !== chat.chatWith.userId
                                        ? `Você: ${chat.lastMessage?.text.slice(0, 20)}...`
                                        : chat.lastMessage.text.slice(0, 20) + '...'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className="text-xs text-gray-400">
                                {formatRelativeDate(chat.lastMessage?.createdAt ?? '')}
                            </span>
                            {chat.unreadMessagesCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                    {chat.unreadMessagesCount}
                                </div>
                            )}
                        </div>
                    </div>
                )) : chats.filter(chat => `
                    ${chat.chatWith.name} 
                  `.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
                ).map((chat, i) => (
                    <div
                        onClick={() => setChat(chat)}
                        key={i}
                        className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">
                                <Image
                                    width={50}
                                    height={50}
                                    src={chat.chatWith.photo}
                                    alt="User"
                                    className="object-cover rounded-full w-full h-full"
                                />
                            </div>
                            <div>
                                <p className="text-base font-medium">{chat.chatWith.name}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {chat.lastMessage?.senderId !== chat.chatWith.userId
                                        ? `Você: ${chat.lastMessage?.text.slice(0, 20)}...`
                                        : chat.lastMessage.text.slice(0, 20) + '...'}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className="text-xs text-gray-400">
                                {formatRelativeDate(chat.lastMessage?.createdAt ?? '')}
                            </span>
                            {chat.unreadMessagesCount > 0 && (
                                <div className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-1">
                                    {chat.unreadMessagesCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
