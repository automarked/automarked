export interface ChatMessage {
    _id: string;
    text: string;
    createdAt: string;
    user: {
        _id: string
        name: string
    };
}

export interface Chat {
    chatId: string;
    participants: string[];
    chatWith: { userId: string, name: string; photo: string };
    unreadMessagesCount: number;
    lastMessage: {
        text: string;
        senderId: string;
        createdAt: string;
    } | null;
}
