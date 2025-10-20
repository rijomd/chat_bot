import { BASE_API_URL } from "@/constants/authConstants";
import { LoginCredentials } from "@/types/login";

type LoginDataType = { email: string, password: string };

export const signInActions = async (formData: LoginDataType) => {
    try {
        const res = await fetch(`${BASE_API_URL}/user/signIn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            throw new Error("Sign In failed");
        }

    } catch (err) {
        console.error("❌ sign in error:", err);
    }
}

export const loginInActions = async (credentials: LoginCredentials) => {
    try {
        console.log(`${BASE_API_URL}/user/login`, " path");

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