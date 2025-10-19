"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import { urlPaths } from "@/constants/pathConstants";

export function TokenExpiry() {
    const { data: session } = useSession();
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (!session) return;

        // Get expiry time from session (you need to add this in JWT callback)
        const expiryTime = (session as any).expires
            ? new Date((session as any).expires).getTime()
            : Date.now() + 1 * 24 * 60 * 60 * 1000; // Default 1 day

        const interval = setInterval(() => {
            const now = Date.now();
            const diff = expiryTime - now;

            if (diff <= 0) {
                // Session expired, force logout
                signOut({ callbackUrl: urlPaths.LOGIN });
                clearInterval(interval);
                return;
            }

            // Convert to readable format
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }, 1000);

        return () => clearInterval(interval);
    }, [session]);

    return (
        <div className="text-sm text-gray-600">
            Session expires in: {timeLeft}
        </div>
    );
}