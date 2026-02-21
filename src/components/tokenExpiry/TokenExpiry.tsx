"use client";

import { useAutoTokenExpiry } from "@/lib/hook";

export function TokenExpiry() {
    const {
        showExpiryWarning,
        timeLeft,
        isExpired,
        isExtending,
        dismissWarning,
        manualExtend,
        rememberMe
    } = useAutoTokenExpiry();

    if (!showExpiryWarning) {
        return null;
    }

    // Show extending loader
    if (isExtending) {
        return (
            <div className="fixed inset-0 bg-green-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-green-600 mb-2">Extending Session</h2>
                            <p className="text-gray-600">Please wait while we refresh your session...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show expired message (will auto-redirect)
    if (isExpired) {
        return (
            <div className="fixed inset-0 bg-red-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
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
                        Your session has expired. {rememberMe ? "Attempting to extend..." : "Redirecting to login..."}
                    </p>
                </div>
            </div>
        );
    }

    // Show warning with extend option
    return (
        <div className="fixed inset-0 bg-yellow-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border-2 border-yellow-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-yellow-700">Session Expiring Soon</h2>
                        <p className="text-sm text-gray-600">Time remaining: <span className="font-semibold text-yellow-600">{timeLeft}</span></p>
                    </div>
                </div>
                <p className="text-gray-700 mb-6">
                    {rememberMe
                        ? "Your session will expire soon. Click 'Extend Now' to continue for another day, or dismiss to let it expire naturally."
                        : "Your session will expire soon. You will be logged out automatically."
                    }
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={dismissWarning}
                        className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                    >
                        Dismiss
                    </button>
                    {rememberMe && (
                        <button
                            onClick={manualExtend}
                            disabled={isExtending}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isExtending ? "Extending..." : "Extend Now"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}