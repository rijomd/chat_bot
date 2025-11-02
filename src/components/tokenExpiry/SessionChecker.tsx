"use client";

import React, { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SESSION_STATUS } from '@/constants/requestsConstants';
import { useCredentialStore } from '@/lib/hook';

export const SessionChecker = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { getStoredPassword, storedEmail, rememberMe } = useCredentialStore();
    const [isChecking, setIsChecking] = useState(true);
    const [isAutoExtending, setIsAutoExtending] = useState(false);

    useEffect(() => {
        const checkAndExtendSession = async () => {
            if (status === SESSION_STATUS.LOADING) {
                return;
            }

            if (status === SESSION_STATUS.UN_AUTHENTICATED) {
                setIsChecking(false);
                return;
            }

            if (status === SESSION_STATUS.AUTHENTICATED && session) {
                const expiresAt = (session as any).expiresAt;
                const currentTime = Math.floor(Date.now() / 1000);

                // Check if session expired (important for server restart)
                if (expiresAt && currentTime > expiresAt) {
                    // If remember me is enabled, try auto-extend
                    if (rememberMe && storedEmail) {
                        console.log("🔄 Auto-extending expired session...");
                        setIsAutoExtending(true);

                        try {
                            const password = getStoredPassword();

                            if (!password) {
                                router.push("/login?reason=expired");
                                return;
                            }

                            const result = await signIn("credentials", {
                                redirect: false,
                                email: storedEmail,
                                password: password,
                            });

                            if (result?.ok) {
                                window.location.reload();
                                return;
                            } else {
                                router.push("/login?reason=extend_failed");
                                return;
                            }
                        } catch (error) {
                            router.push("/login?reason=error");
                            return;
                        }
                    } else {
                        router.push("/login?reason=expired");
                        return;
                    }
                }

                // try {
                //     const response = await fetch("/api/auth/validate", {
                //         method: "POST",
                //         headers: { "Content-Type": "application/json" },
                //     });

                //     if (!response.ok || response.status === StatusCodes.UN_AUTHORIZED) {
                //         // Try auto-extend if enabled  needed then
                //         if (rememberMe && storedEmail) {
                //             setIsAutoExtending(true);
                //             const password = getStoredPassword();

                //             if (password) {
                //                 const result = await signIn("credentials", {
                //                     redirect: false,
                //                     email: storedEmail,
                //                     password: password,
                //                 });

                //                 if (result?.ok) {
                //                     window.location.reload();
                //                     return;
                //                 }
                //             }
                //         }

                //         router.push("/login?reason=invalid");
                //         return;
                //     }

                // } catch (error) {
                //     console.error("Validation error:", error);
                // }
            }

            setIsChecking(false);
            setIsAutoExtending(false);
        };

        checkAndExtendSession();
    }, [session, status, router, rememberMe, storedEmail, getStoredPassword]);

    // Show loading while checking or auto-extending
    if ((isChecking || isAutoExtending) && status !== "unauthenticated") {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">
                        {isAutoExtending ? "Extending session..." : "Validating session..."}
                    </p>
                    {isAutoExtending && (
                        <p className="text-sm text-gray-500 mt-2">
                            Auto-login in progress
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return null;
}