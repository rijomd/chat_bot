"use client";

import { signOut } from "next-auth/react";
import { useAuth, useLoadingBackdrop } from "@/lib/hook";
import { urlPaths } from "@/constants/pathConstants";
import { TokenExpiry } from "@/components/tokenExpiry/TokenExpiry";

export default function Home() {
  const { session, isLoading } = useAuth(false); //   require auth
  const { LoadingBackdrop } = useLoadingBackdrop(isLoading);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="space-y-2">
          <p>Welcome, {session?.user?.email}!</p>
          <p>User ID: {(session?.user as any)?.id}</p>

          <TokenExpiry />

          <button
            onClick={() => signOut({ callbackUrl: urlPaths.LOGIN })}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
      <LoadingBackdrop />
    </div>
  );
}
