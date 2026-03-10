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

export type SenderType = 'USER' | 'BOT';
export type ContentType = 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
export type Status = 'SENT' | 'DELIVERED' | 'READ';

export type ChatbotMessage = {
    id: string;
    chatbotUserConversationId?: string;
    chatbotId: string;
    senderId?: number;
    content: string;
    senderType: SenderType;
    type?: ContentType;
    status?: Status;
    createdAt: Date;
    sender?: {
        id: number;
        name: string;
        email?: string;
    };
}

