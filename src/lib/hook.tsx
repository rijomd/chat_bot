"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SESSION_CONSTANTS } from "@/constants/requestsConstants";
import { urlPaths } from "@/constants/pathConstants";

export function useAuth(requireAuth = true) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === SESSION_CONSTANTS.LOADING) return;

        if (requireAuth && status === SESSION_CONSTANTS.UN_AUTHENTICATED) {
            router.push(urlPaths.LOGIN);
        } else if (!requireAuth && status === SESSION_CONSTANTS.AUTHENTICATED) {
            router.push(urlPaths.DASHBOARD);
        }
    }, [status, requireAuth, router]);

    return { session, status, isLoading: status === SESSION_CONSTANTS.LOADING };
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
};
