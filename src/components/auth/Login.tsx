"use client"
import React, { useState } from 'react'
import { InputText } from '../formElements/InputText'
import { Button } from '../formElements/Button'
import { CheckBox } from '../formElements/CheckBox'
import { useCredentialStore } from '@/lib/hook'
import { LoginDataType } from '@/types/login'

type Props = {
    handleLogin: (data: LoginDataType) => void;
    isLoading: boolean
}



export const Login = ({ handleLogin, isLoading }: Props) => {
    const { saveCredentials, rememberMe: storedRememberMe } = useCredentialStore();
    const [loginData, setLoginData] = useState<LoginDataType>(
        { email: "", password: "", rememberMe: storedRememberMe || false }
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
                <CheckBox id="rememberMe" label="Remember me (Enable auto-extend session)" checked={loginData.rememberMe}
                    onChange={(checked) => setLoginData({ ...loginData, rememberMe: checked })} />
                <Button label='submit' isLoading={isLoading} />
            </form>
        </>
    )
}