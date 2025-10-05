import { BASE_URL } from "@/constants/authConstants";

type LoginDataType = { email: string, password: string };

export const signInActions = async (formData: LoginDataType) => {
    try {
        const res = await fetch(`${BASE_URL}/user/signIn`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            throw new Error("Sign In failed");
        }

        const data = await res.json();
        console.log("✅ sign in success:", data);
    } catch (err) {
        console.error("❌ sign in error:", err);
    }
}

export const loginInActions = async (formData: LoginDataType) => {
    try {

        const res = await fetch(`${BASE_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            throw new Error("Login failed");
        }

        const data = await res.json();
        console.log("✅ Login success:", data);
        return data;
    } catch (err) {
        console.error("❌ Login error:", err);
    }
}