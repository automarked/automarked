"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Menu, VerifiedIcon } from "lucide-react";
import { IUser } from "@/models/user";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useNotificationContext } from "@/contexts/notificationContext";
import { useRouter } from "next/navigation";
import { BsChatLeftText } from "react-icons/bs";
import { IMessage, useChatContext } from "@/contexts/chatContext";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment-timezone";
import GoBack from "@/components/goBack";

interface ChatScreenProps {
    sender: IUser;
    receiver: IUser;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ sender, receiver }) => {
    const { messages, sendMessage, setMessage, message, setReceiverId } = useChatContext()
    const { toggleSidebar } = useMaterialLayout()
    const { unreadNotifications, unreadMessagesCount } = useNotificationContext()
    const { getUnreadMessagesCount, unreadMessagesCount: unreadMessagesCountContext } = useChatContext()
    const [isMouseHoverMessage, setIsMouseHoverMessage] = useState(false);
    const [isCurrentMessageOver, setIsCurrentMessageOver] = useState<number | null>(null);
    const [isOpenedMoreOption, setIsOpenedMoreOption] = useState<{ open: boolean, sender: boolean } | null>(null);

    const handleMessageOver = (index: number) => {
        setIsMouseHoverMessage(true);
        setIsCurrentMessageOver(index);
    };

    const handleMessageOut = () => {
        setIsMouseHoverMessage(false);
        setIsCurrentMessageOver(null);
    };

    const handleMoreOptions = () => {

    };
    useEffect(() => {
        setReceiverId(receiver.userId)
    }, [receiver])

    useEffect(() => {
        getUnreadMessagesCount();
    }, [unreadMessagesCount])

    const router = useRouter();

    const onSend = useCallback(async () => {
        if (!message.trim()) return;
        await sendMessage()
        setMessage("");

    }, [messages, sendMessage, setMessage, message]);

    useEffect(() => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimeZone(userTimeZone);
    }, []);

    const [timeZone, setTimeZone] = useState<string>('');
    function getCurrentTime() {
        const time = moment().tz(timeZone).format('YYYY-MM-DD HH:mm:ss');

        return time
    }
    function restructureTimeDisplay(time: string) {
        return time.length < 2 ? "0" + time : time
    }

    function getTimeOfSentMessage(time: Date | number) {
        const hour = new Date(time).getHours().toString()
        const minutes = new Date(time).getMinutes().toString()

        return restructureTimeDisplay(hour) + ":" + restructureTimeDisplay(minutes)
    }

    const [isAditActive, setIsAditActive] = useState<boolean>(false);

    return (
        <>
            <div className="flex flex-col h-screen overflow-y-scroll bg-white">
                <div className="flex z-[777] items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0">
                    <div className="flex items-center space-x-2">
                        <Avatar>
                            <AvatarImage className="object-cover" src={receiver.photo} alt="Receiver Profile" />
                            <AvatarFallback>
                                {receiver.firstName[0]}
                                {receiver.lastName[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-sm font-medium">
                                {receiver.firstName} {receiver.lastName}{" "}
                                <VerifiedIcon className="inline-block text-blue-500" size={16} />
                            </h2>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <GoBack className='relative mt-[-15px]' />
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
                <div className="h-full px-4 pt-12 space-y-4">
                    {messages.map((msg, index) => {
                        const isSender = msg.user._id === sender.userId;
                        const isCurrentMessage = isCurrentMessageOver === index;
                        // handleDisplayAditOption(msg.createdAt)
                        return (
                            <div
                                onMouseOver={() => handleMessageOver(index)}
                                onMouseOut={handleMessageOut}
                                key={msg._id}
                                className={cn(
                                    "flex items-center space-x-3 max-w-xs mb-4",
                                    index === (messages.length - 1) && "pb-5",
                                    isSender ? "ml-auto justify-end" : "mr-auto"
                                )}
                            >
                                {!isSender && (
                                    <Avatar>
                                        <AvatarImage src={receiver.photo} className="object-cover" alt="Receiver Avatar" />
                                        <AvatarFallback>
                                            {receiver.firstName[0]}
                                            {receiver.lastName[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                                {/* {isSender && (
                                    <DropdownMenu>
                                        <div className="flex self-start">
                                            <DropdownMenuTrigger onClick={handleMoreOptions} className="cursor-pointer flex justify-start">
                                              
                                                <img src="/images/more-vertical.svg" alt="Mais opções" className="w-4 h-3" />
                                         
                                            </DropdownMenuTrigger>
                                        </div>
                                        <DropdownMenuContent>
                                            {isAditActive ?? <DropdownMenuItem>Editar</DropdownMenuItem>}
                                            <DropdownMenuItem>Remover</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )} */}
                                <div
                                    className={cn(
                                        "py-3 px-4 rounded-lg text-sm flex",
                                        isSender
                                            ? "bg-gradient-to-r from-[#101010] to-[#313130] text-white rounded-tr-none"
                                            : "bg-gray-200 text-gray-900 rounded-tl-none"
                                    )}

                                >
                                    <span>{msg.text}</span>
                                    <div className="time text-[.6rem] ms-4 p-2 relative">
                                        <span className="absolute right-[-7px] bottom-[-8px]">{getTimeOfSentMessage(msg.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="h-14"></div>
                </div>
            </div >
            <div className="flex max-h-28 fixed bottom-0 w-full items-center px-6 py-2 bg-white border-t border-gray-200">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-[#E7E9F0] border-none outline-none min-h-14 max-h-28 grow h-full"
                />
                <Button onClick={onSend} className="ml-2">
                    Enviar
                </Button>
            </div>
        </>
    );
};

export default ChatScreen;
