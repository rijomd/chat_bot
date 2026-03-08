export type Chatbot = {
    id: string;
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    backgroundColor?: string;
    textColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type ChatbotUserConversation = {
    id: string;
    chatbotId: string;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
    chatbot?: Chatbot;
}

export type ChatbotMessage = {
    id: string;
    chatbotUserConversationId?: string;
    chatbotId: string;
    senderId?: number;
    content: string;
    senderType: 'USER' | 'BOT';
    type?: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
    status?: 'SENT' | 'DELIVERED' | 'READ';
    createdAt: Date;
    sender?: {
        id: number;
        name: string;
        email?: string;
    };
}

