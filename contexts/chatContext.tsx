import io, { Socket } from 'socket.io-client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createdInstance } from '../hooks/useApi';
import { FileAPIURL } from '@/constants/api';
import { Chat } from '@/models/chatMessage';

export interface User {
    _id: string | number;
    name?: string;
    avatar?: string;
} 

export interface Reply {    
    title: string;
    value: string;
    messageId?: number | string;
}

export interface IMessage {
    _id: string | number;
    text: string;
    createdAt: Date | number;
    user: User;
}

interface ChatContextProps {
    messages: IMessage[];
    chats: Chat[];
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    setReceiverId: React.Dispatch<React.SetStateAction<string | undefined>>;
    sendMessage: () => Promise<void>;
    unreadMessagesCount: number;
    getAllMessagesOrChats: () => Promise<void>;
    senderId: string;
    getUnreadMessagesCount: () => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ senderId: string, children: React.ReactNode }> = ({ senderId, children }) => {
    const [socket, setSocket] = useState<null | typeof Socket>(null);
    const [receiverId, setReceiverId] = useState<string | undefined>(undefined);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [message, setMessage] = useState('');
    const [chats, setChats] = useState<Chat[]>([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);

    // Carrega as mensagens ou os chats do usuário
    const getAllMessagesOrChats = useCallback(async () => {
        if (receiverId) {
            // Carregar mensagens entre o `senderId` e o `receiverId`      
            const response = await createdInstance.get<{ messages: IMessage[] }>(
                `/chat/messages?senderId=${senderId}&receiverId=${receiverId}`
            );
            if (response.status === 200) {
                setMessages(response.data.messages);
            }
        } else {
            // Carregar todos os chats do `senderId`
            const response = await createdInstance.get<{ chats: Chat[] }>(
                `/chat/user-chats?userId=${senderId}`
            );    

            if (response.status === 200) {
                setChats(response.data.chats);
                await getUnreadMessagesCount(); // Buscar o total de mensagens não lidas após carregar os chats
            }
        }
    }, [senderId, receiverId]);

    // Função para buscar o total de mensagens não lidas
    const getUnreadMessagesCount = useCallback(async () => {
        const response = await createdInstance.get<{ totalUnreadMessages: number }>(
            `/chat/unread/${senderId}`
        );

        if (response.status === 200) {
            setUnreadMessagesCount(response.data.totalUnreadMessages);
        }
    }, [senderId]);

    // Conectar ao Socket.IO e inicializar os dados
    useEffect(() => {
        getAllMessagesOrChats();
        const socketInstance = io(FileAPIURL, {
            transports: ['websocket'], // Evitar problemas com transporte no React Native
        });
        setSocket(socketInstance);

        if (receiverId) {
            socketInstance.emit('joinRoom', { senderId: senderId, receiverId: receiverId });

            socketInstance.on('newMessage', (newMessage: IMessage) => {
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                getUnreadMessagesCount(); // Atualizar o contador de mensagens não lidas
            });
        }

        return () => {
            socketInstance.disconnect();
        };
    }, [senderId, receiverId, getAllMessagesOrChats, getUnreadMessagesCount]);

    // Função para enviar mensagem
    const sendMessage = async () => {
        if (socket && message.trim() && receiverId) {
            try {
                const timestamp = new Date();
                const createdMessage = {
                    senderId: senderId,
                    receiverId: receiverId,
                    message,
                };

                socket.emit('sendMessage', { ...createdMessage, timestamp: timestamp.toISOString() });

                setMessage('');
            } catch (error) {
                console.error('Erro ao enviar mensagem:', error);
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                chats,
                message,
                setMessage,
                setReceiverId,
                sendMessage,
                unreadMessagesCount,
                getAllMessagesOrChats,
                senderId,
                getUnreadMessagesCount
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};