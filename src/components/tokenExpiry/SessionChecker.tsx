"use client";

import React, { useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react';
import { urlPaths } from '@/constants/pathConstants';

export const SessionChecker = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated" && session) {
            const expiresAt = (session as any).expiresAt;
            const currentTime = Math.floor(Date.now() / 1000);

            if (expiresAt && currentTime > expiresAt) {
                console.error("🔴 Session expired while offline, logging out...");
                signOut({ callbackUrl: urlPaths.LOGIN });
            }
        }
    }, [session, status]);

    return null;
}
