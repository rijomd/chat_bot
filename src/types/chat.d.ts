export type User = {
    id: number,
    name: string,
    email: string,
    createdAt: string
}

export type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: number;
    senderName: string;
    content: string;
    createdAt: string;
    type: 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
    status: 'SENT' | 'DELIVERED' | 'READ';
}

export type ConversationData = {
    id: string;
    messages?: ChatMessage[];
    participants: Array<{ id: number; name: string; email: string }>;
}

export type Conversation = {
    id: string;
    participants: User[];
    lastMessage?: ChatMessage;
    updatedAt: string;
}