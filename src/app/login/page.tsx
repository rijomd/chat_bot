"use client";
import React, { useState } from 'react'
import { Login } from '@/components/auth/Login'
import { Signup } from '@/components/auth/Signup';
import { loginInActions, signInActions } from '@/actions/authActions';
import { signIn } from "next-auth/react";

type Props = {}
type LoginDataType = { email: string, password: string };
type SignInDataType = { email: string, password: string, name: string };

export default function AuthPage(props: Props) {
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = async (e: LoginDataType) => {

        const res = await signIn("credentials", {
            redirect: false,
            email: e.email,
            password: e.password,
        });
        console.log(res, "res login");

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
                    Bus Reservation BS
                </h1>
                <div>
                    {isSignUp ? <Signup handleSignUp={handleSignUp} /> : <Login handleLogin={handleLogin} />}

                </div>

                <div className="mt-4 text-center text-sm">
                    <span className="text-gray-600">Don’t have an account? </span>
                    <a onClick={changeContent} className="text-blue-600 hover:underline cursor-pointer">
                        Sign up
                    </a>
                </div>

            </div>
        </div>
    )
}
