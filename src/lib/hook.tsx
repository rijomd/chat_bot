"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SESSION_STATUS, STORAGE_KEY } from "@/constants/requestsConstants";
import { urlPaths } from "@/constants/pathConstants";
import { TOKEN_EXPIRED_CHECK_INTERVAL, TOKEN_EXPIRED_POPUP_TIMEOUT, TOKEN_EXPIRED_WARN_CHECK } from "@/constants/authConstants";
import { StoredCredentials } from "@/types/stored-creds";

// for auth is needed or not (eg: login page no need auth, dashboard need auth)
export function useAuth(requireAuth = true) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === SESSION_STATUS.LOADING) return;

        if (requireAuth && status === SESSION_STATUS.UN_AUTHENTICATED) {
            router.push(urlPaths.LOGIN);
        } else if (!requireAuth && status === SESSION_STATUS.AUTHENTICATED) {
            router.push(urlPaths.DASHBOARD);
        }
    }, [status, requireAuth, router]);

    return { session, status, isLoading: status === SESSION_STATUS.LOADING };
}

export const useLoadingBackdrop = (isLoading: boolean) => {
    const LoadingBackdrop = () => (
        isLoading ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        ) : null
    );

    return { LoadingBackdrop };
}

// check if token is expired
export function useAutoTokenExpiry() {
    const { data: session, status } = useSession();
    const { getStoredPassword, storedEmail, rememberMe } = useCredentialStore();

    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);
    const [isExtending, setIsExtending] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        if (status !== SESSION_STATUS.AUTHENTICATED || !session) {
            return;
        }

        const expiresAt = (session as any).expiresAt;

        if (!expiresAt) {
            return;
        }

        const checkExpiry = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeRemaining = expiresAt - currentTime;

            if (timeRemaining <= 0) {
                console.log("🔴 Token expired");
                setIsExpired(true);
                setShowExpiryWarning(true);
                setIsDismissed(false);

                // Try auto-extend if remember me is enabled
                if (rememberMe && storedEmail) {
                    handleAutoExtend();
                } else {
                    // No auto-login, show expiry message
                    setTimeout(() => {
                        window.location.href = urlPaths.LOGIN;
                    }, TOKEN_EXPIRED_POPUP_TIMEOUT);
                }
                return;
            }

            const warningThreshold = TOKEN_EXPIRED_WARN_CHECK;
            if (timeRemaining <= warningThreshold && !isDismissed) {
                setShowExpiryWarning(true);
            }

            // Format time
            const days = Math.floor(timeRemaining / (60 * 60 * 24));
            const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
            const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
            const seconds = timeRemaining % 60;

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h ${minutes}m`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes}m ${seconds}s`);
            } else {
                setTimeLeft(`${seconds}s`);
            }
        };

        checkExpiry();
        const interval = setInterval(checkExpiry, TOKEN_EXPIRED_CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [session, status, showExpiryWarning, rememberMe, storedEmail, isDismissed]);

    const handleAutoExtend = async () => {
        if (isExtending) return;

        setIsExtending(true);
        console.log("🔄 Auto-extending session...");

        try {
            const password = getStoredPassword();

            if (!password || !storedEmail) {
                console.error("No stored credentials found");
                setIsExtending(false);
                setTimeout(() => {
                    window.location.href = urlPaths.LOGIN;
                }, TOKEN_EXPIRED_POPUP_TIMEOUT);
                return;
            }

            // Re-authenticate with stored credentials
            const result = await signIn("credentials", {
                redirect: false,
                email: storedEmail,
                password: password,
            });

            if (result?.ok) {
                console.log("✅ Session extended successfully");
                setShowExpiryWarning(false);
                setIsExpired(false);
                setIsDismissed(false);
                // Reload to get fresh session
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                console.error("❌ Auto-extend failed:", result?.error);
                setTimeout(() => {
                    window.location.href = urlPaths.LOGIN;
                }, TOKEN_EXPIRED_POPUP_TIMEOUT);
            }

        } catch (error) {
            console.error("Auto-extend error:", error);
            setTimeout(() => {
                window.location.href = urlPaths.LOGIN;
            }, TOKEN_EXPIRED_POPUP_TIMEOUT);

        } finally {
            setIsExtending(false);
        }
    };

    const manualExtend = async () => {
        await handleAutoExtend();
    };

    const dismissWarning = () => {
        setShowExpiryWarning(false);
        setIsDismissed(true);
    };

    return {
        showExpiryWarning,
        timeLeft,
        isExpired,
        isExtending,
        dismissWarning,
        manualExtend,
        rememberMe,
        expiresAt: (session as any)?.expiresAt,
    };
}


// for remember me functionality
export function useCredentialStore() {
    const [storedEmail, setStoredEmail] = useState<string>("");
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        // Load stored credentials on mount
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const data: StoredCredentials = JSON.parse(stored);
                    setStoredEmail(data?.email || "");
                    setRememberMe(data?.rememberMe || false);
                } catch (error) {
                    console.error("Failed to load stored credentials:", error);
                }
            }
        }
    }, []);

    const saveCredentials = (email: string, password: string, remember: boolean) => {
        if (remember) {
            // Simple encoding (NOT encryption)
            const encoded = btoa(password);
            const data: StoredCredentials = {
                email,
                rememberMe: true,
                encryptedPassword: encoded,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    const getStoredPassword = (): string | null => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: StoredCredentials = JSON.parse(stored);
                if (data.encryptedPassword) {
                    return atob(data.encryptedPassword); //decode
                }
            }
        } catch (error) {
            console.error("Failed to get stored password:", error);
        }
        return null;
    };

    const clearCredentials = () => {
        localStorage.removeItem(STORAGE_KEY);
        setStoredEmail("");
        setRememberMe(false);
    };

    return {
        storedEmail,
        rememberMe,
        saveCredentials,
        getStoredPassword,
        clearCredentials,
    };
}