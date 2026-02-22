import React from 'react';
import { urlPaths } from '@/constants/pathConstants';
import { signOut } from 'next-auth/react';

type Props = {
    appName?: string;
}

export const Header: React.FC<Props> = ({ appName = "Chat Bot" }) => {
    return (
        <header className="min-h-[72px] fixed top-0 left-0 w-full h-14 bg-[url('/header.jpg')] bg-cover bg-center bg-no-repeat border-b border-green-200 shadow-sm flex items-center justify-between px-4 z-50">
            <h1 className="text-lg font-semibold text-green-800">
                {appName}
            </h1>

            <button
                onClick={async () => {
                    await signOut({ callbackUrl: urlPaths.LOGIN });

                }}
                className="flex items-center gap-1 text-green-800 cursor-pointer font-semibold"
            >
                <span>Log Out</span>
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                </svg>
            </button>

        </header>
    )
}