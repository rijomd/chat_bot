"use client";
import React, { useState } from 'react'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Login } from '@/components/auth/Login'
import { Signup } from '@/components/auth/Signup';
import { signInActions } from '@/actions/authActions';

import { LoginDataType, SignInDataType } from '@/types/login';
import { Modal } from '@/components/utils/Modal';
import { ModalType } from '@/types/modal';
import { DEFAULT_PATH } from '@/constants/pathConstants';
import { useAuth, useLoadingBackdrop } from '@/lib/hook';

const modalPopupValues: Record<ModalType, ModalType> = {
    error: "error",
    success: "success",
    warning: "warning",
    "": "",
};

const initial = { msg: "", value: modalPopupValues[''] };

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSuccess, setIsSuccess] = useState<{ msg: string, value: ModalType }>(initial);
    const [isSubmit, setIsSubmit] = useState(false);
    const router = useRouter();

    const { isLoading } = useAuth(false); // false = don't require auth
    const { LoadingBackdrop } = useLoadingBackdrop(isLoading);

    const handleLogin = async (e: LoginDataType) => {
        try {
            setIsSubmit(true);
            const res = await signIn("credentials", {
                redirect: false,
                email: e.email,
                password: e.password,
            });

            setIsSubmit(false);

            if (res?.error) {
                setIsSuccess({ msg: "Authentication error :- " + res?.error, value: modalPopupValues.error });
            }

            if (res?.ok) {
                setIsSuccess({ msg: "Login successful", value: modalPopupValues.success });

            }
        } catch (error) {
            console.error("Login error:", error);
            setIsSuccess({ msg: "An error occurred during login", value: modalPopupValues.error });
        }
    }

    const handleSignUp = (e: SignInDataType) => {
        signInActions(e);
    }

    const changeContent = () => {
        setIsSignUp(!isSignUp);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-300 p-4 animate-gradient-move">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
                <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-100 via-blue-200 to-indigo-600 bg-clip-text text-transparent animate-gradient-move">
                    CHAT Box
                </h1>
                <div>
                    {isSignUp ? <Signup handleSignUp={handleSignUp} isLoading={isSubmit} /> : <Login handleLogin={handleLogin} isLoading={isSubmit} />}

                </div>

                <div className="mt-4 text-center text-sm">
                    <span className="text-gray-600">Don’t have an account? </span>
                    <a onClick={changeContent} className="text-blue-600 hover:underline cursor-pointer">
                        Sign up
                    </a>
                </div>

                <Modal show={isSuccess.value.length > 0}
                    type={isSuccess.value}
                    message={isSuccess.msg}
                    onClose={() => {
                        setIsSuccess(initial);
                        if (isSuccess.value !== modalPopupValues.success) return;
                        router.push(DEFAULT_PATH);
                        router.refresh(); // Refresh to update session
                    }}
                />

                <LoadingBackdrop />

            </div>
        </div>
    )
}
