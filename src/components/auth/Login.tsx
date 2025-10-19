"use client"
import React, { useState } from 'react'
import { InputText } from '../formElements/InputText'
import { Button } from '../formElements/Button'

type Props = {
    handleLogin: (data: LoginDataType) => void;
    isLoading: boolean
}

type LoginDataType = { email: string, password: string };


export const Login = ({ handleLogin, isLoading }: Props) => {

    const [loginData, setLoginData] = useState<LoginDataType>(
        { email: "", password: "" }
    );

    const handleChange = (name: string, value: string | number) => {
        setLoginData({
            ...loginData, [name]: value
        });
    }

    return (
        <>
            <form method="post" onSubmit={(e) => { e.preventDefault(); handleLogin(loginData) }} className="space-y-4">
                <InputText onChange={handleChange} label="Email" value={loginData.email} inputName={'email'} required />
                <InputText onChange={handleChange} label="Password" value={loginData.password} inputName={'password'} required />
                <Button label='submit' isLoading={isLoading} />
            </form>
        </>
    )
}