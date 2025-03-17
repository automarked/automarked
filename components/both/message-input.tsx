import { FC, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useChatContext } from "@/contexts/chatContext";
import { Button } from "../ui/button";

const MessageInput: FC<{ receiverPhoto: string, sendername: string }> = ({ receiverPhoto, sendername }) => {
    const { messages, sendMessage, setMessage, message, senderId } = useChatContext()
    const onSend = useCallback(async () => {
        if (!message.trim()) return;
        await sendMessage()
        setMessage("");
    }, [messages, sendMessage, setMessage, message]);

    function restructureTimeDisplay(time: string) {
        return time.length < 2 ? "0" + time : time
    }

    function getTimeOfSentMessage(time: Date | number) {
        const hour = new Date(time).getHours().toString()
        const minutes = new Date(time).getMinutes().toString()

        return restructureTimeDisplay(hour) + ":" + restructureTimeDisplay(minutes)
    }
    
    return (
        <div className="flex flex-col h-full relative">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-20">
                {messages.map((msg, index) => {
                    const isSender = msg.user._id === senderId;
                    return (
                        <div
                            key={msg._id}
                            className={cn(
                                "flex items-center space-x-3 max-w-lg mb-4",
                                isSender ? "ml-auto justify-end" : "mr-auto"
                            )}
                        >
                            {!isSender && (
                                <Avatar>
                                    <AvatarImage src={receiverPhoto} className="object-cover" alt="Foto do usuário" />
                                    <AvatarFallback>
                                        {sendername.split(' ')[0][0]}
                                        {sendername.split(' ')[1]?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    "py-3 px-4 rounded-lg text-sm flex",
                                    isSender
                                        ? "bg-gradient-to-r from-[#101010] to-[#313130] text-white rounded-tr-none"
                                        : "bg-gray-200 text-gray-900 rounded-tl-none",
                                        index === (messages.length - 1) && "mb-10"
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
            </div>

            {/* Send message - fixed at bottom */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
                <div className="flex items-center px-4 py-2">
                    <Textarea
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            // Auto-resize
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                        }}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 text-sm text-slate-700 bg-[#E7E9F0] border-none outline-none min-h-14 max-h-28 resize-none"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                onSend();
                            }
                        }}
                    />
                    <Button onClick={onSend} className="ml-2">
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;