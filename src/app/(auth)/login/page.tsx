"use client";
import React, { useState, useEffect } from 'react'
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Login } from '@/components/auth/Login'
import { Signup } from '@/components/auth/Signup';
import { signInActions } from '@/actions/authActions';

import { LoginDataType, SignInDataType } from '@/types/login';
import { Modal } from '@/components/utils/Modal';
import { ModalType } from '@/types/modal';
import { DEFAULT_PATH } from '@/constants/pathConstants';
import { useCredentialStore, useLoadingBackdrop } from '@/lib/hook';
import { SESSION_STATUS } from '@/constants/requestsConstants';

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
    const { saveCredentials } = useCredentialStore();
    const { status } = useSession();

    const { LoadingBackdrop } = useLoadingBackdrop(status === SESSION_STATUS.LOADING);

    // Redirect authenticated users to dashboard
    useEffect(() => {
        if (status === SESSION_STATUS.AUTHENTICATED) {
            router.push(DEFAULT_PATH);
        }
    }, [status, router]);

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
                saveCredentials(e.email, e.password, e.rememberMe);
                setIsSuccess({ msg: "Login successful", value: modalPopupValues.success });

            }
        } catch (error) {
            console.error("Login error:", error);
            setIsSuccess({ msg: "An error occurred during login", value: modalPopupValues.error });
        }
    }

    const handleSignUp = async (e: SignInDataType) => {
        try {
            setIsSubmit(true);
            const result = await signInActions(e);
            setIsSubmit(false);

            if (result.success) {
                setIsSuccess({ msg: result.message, value: modalPopupValues.success });
                // Clear form and switch back to login after success
                setTimeout(() => {
                    setIsSignUp(false);
                }, 1500);
            } else {
                setIsSuccess({ msg: result.message, value: modalPopupValues.error });
            }
        } catch (error) {
            setIsSubmit(false);
            console.error("Sign up error:", error);
            setIsSuccess({ msg: "An error occurred during sign up", value: modalPopupValues.error });
        }
    }

    const changeContent = () => {
        setIsSignUp(!isSignUp);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-green-300 p-4 animate-gradient-move">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-green-100 via-green-200 to-emerald-600 bg-clip-text text-transparent animate-gradient-move">
                    cHAT Box
                </h1>

                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm text-center mt-4 mb-4 hidden lg:block">
                    Demo: email: <strong>a@mail.com</strong>, password: <strong>password</strong>
                </div>

                <div>
                    {isSignUp ? <Signup handleSignUp={handleSignUp} isLoading={isSubmit} /> : <Login handleLogin={handleLogin} isLoading={isSubmit} />}

                </div>

                <div className="mt-4 text-center text-sm">
                    <span className="text-gray-600">Don’t have an account? </span>
                    <a onClick={changeContent} className="text-green-600 hover:underline cursor-pointer">
                        {isSignUp ? "Log in" : "Sign In"}
                    </a>
                </div>

                <Modal show={isSuccess.value.length > 0}
                    type={isSuccess.value}
                    message={isSuccess.msg}
                    onClose={() => {
                        setIsSuccess(initial);
                    }}
                />

                <LoadingBackdrop />

            </div>
        </div>
    )
}
