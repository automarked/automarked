import { Chat } from "@/models/chatMessage";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeDate } from "@/scripts/relative-date";
import { Search, Pin, MessageCircle, Menu, Bell, X } from "lucide-react";
import { useState } from "react";
import SearchInput from "./input-search";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoBack from "../goBack";


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
        const { toggleSidebar, isOpen } = useMaterialLayout()
        const { unreadNotifications } = useNotificationContext()
        const [search, setSearch] = useState('')

        const handleChatClick = (chatId: string) => {
            router.push(`/seller/chat/${chatId}`);
            console.log(chatId)
        };

        return (
            <div className="flex flex-col h-full w-full border-r shadow-sm">
                {/* Header */}
               <div className="flex justify-between items-center">
                <div className="flex justify-between py-4 items-center w-full items-end">
                    <span className="md:hidden ">
                        <GoBack className='top-3' />
                        <div className="ms-8 px-4 text-lg font-bold text-black">
                            Conversas
                        </div>
                    </span>
                    <div className="hidden md:flex justify-center items-center h-fit space-x-1">
                        <GoBack className='relative top-[-1px] ' />
                        <div className="px-4 text-lg font-bold text-black flex justify-center items-center h-fit">
                            Conversas
                        </div>
                    </div>
                    {/* <div onClick={() => toggleSidebar()} className="md:hidden flex mr-4 rounded-full hover:text-orange-600 w-7 h-7 justify-center items-center">
                        {isOpen && (
                            <X className='cursor-pointer rounded-full bg-gray-200 hover:text-orange-600 w-full h-full p-1' onClick={() => toggleSidebar()} />
                        )}
                        {!isOpen && (
                            <Menu className='cursor-pointer hover:text-orange-600' size={24} onClick={() => toggleSidebar()} />
                        )}
                    </div> */}
                </div>
                <div className="flex md:hidden items-center space-x-4 mr-4">
                    <div className="relative cursor-pointer hover:text-orange-600 rounded-full" onClick={() => {
                        router.push('/seller/notifications');
                    }}>
                        <Bell />
                        {unreadNotifications.length > 0 && (
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {unreadNotifications.length}
                            </div>
                        )}
                    </div>
                    <div className="w-7 h-7 flex justify-center items-center">
                        {isOpen && (
                            <X className='cursor-pointer rounded-full bg-gray-200 hover:text-orange-600 w-full h-full p-1' onClick={() => toggleSidebar()} />
                        )}
                        {!isOpen && (
                            <Menu className='cursor-pointer hover:text-orange-600' size={24} onClick={() => toggleSidebar()} />
                        )}
                    </div>
                </div>
            </div>

                {/* Search */}
                <div className="p-4 border-b">
                    <SearchInput dark value={search} setValue={setSearch} />
                </div>

                <div className="px-4 py-2 text-xs font-semibold text-gray-500">
                    Todas as mensagens
                </div>

                {search.trim() && (
                    <strong className="pl-4 py-2 font-bold">{`Resultados para "${search}"`}</strong>
                )}

                {/* Chat list - make it scrollable */}
                <div className="flex-1 overflow-y-auto pb-16">
                    <div className="px-4">
                        {/* For desktop view */}
                        <div className="hidden md:block">
                            {!search.trim() ? chats.map((chat, i) => (
                                <div
                                    onClick={() => setChat(chat)}
                                    key={i}
                                    className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">
                                            {chat.chatWith.photo ? (
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={chat.chatWith.photo}
                                                    alt="User"
                                                    className="object-cover rounded-full w-full h-full"
                                                />
                                            ) : (
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {chat.chatWith.name.split(' ')[0][0]}
                                                        {chat.chatWith.name.split(' ')[1]?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
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
                                            {chat.chatWith.photo ? (
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={chat.chatWith.photo}
                                                    alt="User"
                                                    className="object-cover rounded-full w-full h-full"
                                                />
                                            ) : (
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {chat.chatWith.name.split(' ')[0][0]}
                                                        {chat.chatWith.name.split(' ')[1]?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
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

                        {/* For mobile view */}
                        <div className="md:hidden">
                            {!search.trim() ? chats.map((chat, i) => (
                                <div
                                    onClick={() => handleChatClick(chat.chatWith.userId)}
                                    key={i}
                                    className="flex items-center justify-between gap-2 py-3 hover:bg-gray-100 border-b  cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 border-2 border-black p-0.5 overflow-hidden rounded-full">
                                            {chat.chatWith.photo ? (
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={chat.chatWith.photo}
                                                    alt="User"
                                                    className="object-cover rounded-full w-full h-full"
                                                />
                                            ) : (
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {chat.chatWith.name.split(' ')[0][0]}
                                                        {chat.chatWith.name.split(' ')[1]?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
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
                                            {chat.chatWith.photo ? (
                                                <Image
                                                    width={50}
                                                    height={50}
                                                    src={chat.chatWith.photo}
                                                    alt="User"
                                                    className="object-cover rounded-full w-full h-full"
                                                />
                                            ) : (
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {chat.chatWith.name.split(' ')[0][0]}
                                                        {chat.chatWith.name.split(' ')[1]?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
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
                </div>
            </div>
        );
    }
