"use client";

import { signOut } from "next-auth/react";
import { useTokenExpiry } from "@/lib/hook";
import { urlPaths } from "@/constants/pathConstants";

export function TokenExpiry() {
    const { showExpiryWarning, timeLeft, isExpired, dismissWarning } = useTokenExpiry();

    if (!showExpiryWarning) {
        return null;
    }

    if (isExpired) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-red-600">Session Expired</h2>
                        </div>
                    </div>
                    <p className="text-gray-700 mb-6">
                        Your session has expired. You will be logged out automatically.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => signOut({ callbackUrl: urlPaths.LOGIN })}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                        >
                            Logout Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-yellow-600">Session Expiring Soon</h2>
                        <p className="text-sm text-gray-600">Time remaining: {timeLeft}</p>
                    </div>
                </div>
                <p className="text-gray-700 mb-6">
                    Your session will expire soon. Please save your work or extend your session.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={dismissWarning}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Extend Session
                    </button>
                </div>
            </div>
        </div>
    );
}