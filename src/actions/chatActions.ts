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