"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SESSION_STATUS } from "@/constants/requestsConstants";
import { urlPaths } from "@/constants/pathConstants";
import { TOKEN_EXPIRED_CHECK_INTERVAL, TOKEN_EXPIRED_POPUP_TIMEOUT, TOKEN_EXPIRED_WARN_CHECK } from "@/constants/authConstants";

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
export function useTokenExpiry() {
    const { data: session, status } = useSession();
    const [showExpiryWarning, setShowExpiryWarning] = useState(false);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const [isExpired, setIsExpired] = useState(false);

    // Check expiry on mount
    useEffect(() => {
        if (status !== SESSION_STATUS.AUTHENTICATED || !session) {
            return;
        }
        const expiresAt = (session as any).expiresAt;

        if (!expiresAt) {
            console.warn("No expiry timestamp found in session");
            return;
        }

        // Check expiry on mount 
        const checkExpiry = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const timeRemaining = expiresAt - currentTime;
            console.log(timeRemaining, "timeRemaining");

            // If already expired
            if (timeRemaining <= 0) {
                console.error("🔴 Token expired ");
                setIsExpired(true);
                setShowExpiryWarning(true);
                // Auto logout after showing popup
                setTimeout(() => {
                    signOut({ callbackUrl: urlPaths.LOGIN });
                }, TOKEN_EXPIRED_POPUP_TIMEOUT);
                return;
            }

            // Show warning 5 minutes before expiry
            const warningThreshold = TOKEN_EXPIRED_WARN_CHECK;
            if (timeRemaining <= warningThreshold && !showExpiryWarning) {
                setShowExpiryWarning(true);
            }

            // Format time remaining
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

        }

        checkExpiry();
        const interval = setInterval(checkExpiry, TOKEN_EXPIRED_CHECK_INTERVAL); 

        return () => clearInterval(interval);
    }, [session, status, showExpiryWarning]);


    const dismissWarning = () => {
        setShowExpiryWarning(false);
    };

    const extendSession = async () => {
        // Re-authenticate to extend session
        // This would require calling your login API again
        setShowExpiryWarning(false);
    };

    return {
        showExpiryWarning,
        timeLeft,
        isExpired,
        dismissWarning,
        extendSession,
        expiresAt: (session as any)?.expiresAt,
    };

}