"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Footer } from "@/components/outer/Footer";
import { Header } from "@/components/outer/Header";
import { useLoadingBackdrop } from "@/lib/hook";
import { urlPaths } from "@/constants/pathConstants";
import { SESSION_STATUS } from "@/constants/requestsConstants";

export default function ProtectedLayout({ children }: { children: React.ReactNode; }) {
    const { status } = useSession();
    const router = useRouter();
    const { LoadingBackdrop } = useLoadingBackdrop(status === "loading");

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (status === SESSION_STATUS.UN_AUTHENTICATED) {
            router.push(urlPaths.LOGIN);
        }
    }, [status, router]);

    // Show loading backdrop while checking auth status
    if (status === SESSION_STATUS.LOADING) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <LoadingBackdrop />
                <main className="flex-1"></main>
                <Footer />
            </div>
        );
    }

    // Only render content if authenticated
    if (status !== SESSION_STATUS.AUTHENTICATED) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}