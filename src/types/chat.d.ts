export type User = {
    id: number,
    name: string,
    email: string,
    createdAt: string
}

type ContentType = 'TEXT' | 'IMAGE' | 'FILE' | 'AUDIO' | 'VIDEO';
type Status = 'SENT' | 'DELIVERED' | 'READ';

export type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: number;
    senderName: string;
    content: string;
    createdAt: string;
    type: ContentType;
    status: Status;
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