import { BASE_API_URL } from "@/constants/authConstants";
import { LoginCredentials } from "@/types/login";

type LoginDataType = { email: string, password: string, name: string };

export const signInActions = async (formData: LoginDataType) => {
    try {
        const res = await fetch(`${BASE_API_URL}/user/signIn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || "Sign up failed",
                code: data.code || 500
            };
        }

        return {
            success: true,
            message: data.message || "User created successfully",
            code: data.code || 200,
            data: data.data
        };

    } catch (err) {
        console.error("❌ sign up error:", err);
        return {
            success: false,
            message: "Network error. Please try again.",
            code: 500
        };
    }
}

export const loginInActions = async (credentials: LoginCredentials) => {
    try {
        const res = await fetch(`${BASE_API_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
            }),
        });

        const responseData = await res.json();

        if (responseData.code === 200 && responseData.data?.user) {
            const { user, token } = responseData.data;

            return {
                id: user.id,
                email: user.email,
                name: user.name,
                accessToken: token,
            };
        }

        return null;
    } catch (err) {
        console.error("❌ Login error:", err);
        return null;
    }
}