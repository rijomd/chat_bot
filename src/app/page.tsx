"use client";

import { useAuth, useLoadingBackdrop } from "@/lib/hook";
import { signOut } from "next-auth/react";

export default function Home() {
  const { session, isLoading } = useAuth(false); //   require auth
  const { LoadingBackdrop } = useLoadingBackdrop(isLoading);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</button>
      </div>
      <LoadingBackdrop />
    </div>
  );
}
