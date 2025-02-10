import { FC, useCallback } from "react";
import { Plus, Smile, Mic } from "lucide-react";
import { LuSend } from "react-icons/lu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { apiBaseURL } from "@/constants/api";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { useChatContext } from "@/contexts/chatContext";

const MessageInput: FC<{receiverPhoto: string}> = ({ receiverPhoto }) => {
    const { messages, sendMessage, setMessage, message, senderId } = useChatContext()
    const onSend = useCallback(async () => {
        if (!message.trim()) return;
        await sendMessage()
        setMessage("");
    }, [messages, sendMessage, setMessage, message]);
    return (
        <>
            <div className="w-full flex-1 h-[calc(100% - 5rem)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-100 px-4 pt-12 space-y-4 pb-[5rem]">
                {messages.map((msg) => {
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
                                    <AvatarImage src={apiBaseURL + receiverPhoto} className="object-cover" alt="Receiver Avatar" />
                                    <AvatarFallback>
                                        Receiver
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={cn(
                                    "p-3 rounded-lg text-sm",
                                    isSender
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-gray-200 text-gray-900 rounded-tl-none"
                                )}
                            >
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center gap-2 px-4 py-4 pb-24 bg-gray-100 rounded-lg shadow-md">
                {/* Botão de Adicionar */}
                <button className="p-2 rounded-full hover:bg-gray-200">
                    <Plus size={20} className="text-gray-500" />
                </button>

                {/* Campo de Texto */}
                <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2 shadow-inner border border-gray-200">
                    <Smile size={28} className="text-gray-400 mr-2" />
                    <Textarea
                        value={message}
                        cols={4}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Escrever mensagem"
                        className="w-full text-sm text-gray-700 bg-transparent outline-none"
                    />
                </div>

                {/* Botão do Microfone */}
                <button onClick={onSend} className="p-2 rounded-full w-12 h-12 flex justify-center items-center hover:bg-gray-200">
                    <LuSend size={20} className="text-gray-500" />
                </button>
            </div>
        </>
    );
};

export default MessageInput;
