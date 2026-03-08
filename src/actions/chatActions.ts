import { BASE_API_URL } from "@/constants/authConstants";


export const userListAction = async () => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/userList`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching user list",
                code: data.code || 500
            };
        }

        return data.data;

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const myListAction = async () => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/myList`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching my list",
                code: data.code || 500
            };
        }

        return data.data;

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const createNewChat = async (userId: number) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chat/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching my list",
                code: data.code || 500
            };
        }

        return {
            success: true,
            data: data.data
        };

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

// Chatbot Actions

export const chatbotListAction = async () => {
    try {
        const res = await fetch(`${BASE_API_URL}/chatbot/list`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching chatbot list",
                code: data.code || 500
            };
        }

        return data.data;

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const chatbotUserChatsAction = async () => {
    try {
        const res = await fetch(`${BASE_API_URL}/chatbot/user-chats`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching chatbot user chats",
                code: data.code || 500
            };
        }

        return data.data;

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const createChatbotConversation = async (chatbotId: string) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chatbot/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatbotId }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error creating chatbot conversation",
                code: data.code || 500
            };
        }

        return {
            success: true,
            data: data.data
        };

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const getChatbotMessages = async (conversationId: string) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chatbot/messages?conversationId=${conversationId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error fetching messages",
                code: data.code || 500
            };
        }

        return data.data;

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const sendChatbotMessage = async (conversationId: string, content: string) => {
    try {
        const res = await fetch(`${BASE_API_URL}/chatbot/send-message`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ conversationId, content }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Error sending message",
                code: data.code || 500
            };
        }

        return {
            success: true,
            data: data.data
        };

    } catch (err) {
        console.error("❌ error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}