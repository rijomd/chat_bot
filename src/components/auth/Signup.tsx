
import React, { useState } from 'react'
import { InputText } from '../formElements/InputText';
import { Button } from '../formElements/Button';

type Props = {
    handleSignUp: (data: SignInDataType) => void,
    isLoading: boolean
}

type SignInDataType = { email: string, password: string, name: string };


export const Signup = ({ handleSignUp, isLoading }: Props) => {

    const [loginData, setLoginData] = useState<SignInDataType>(
        { email: "", password: "", name: "" }
    );

    const handleChange = (name: string, value: string | number) => {
        setLoginData({
            ...loginData, [name]: value
        });
    }

    return (
        <>
            <form method="post" onSubmit={(e) => { e.preventDefault(); handleSignUp(loginData) }} className="space-y-4">
                <InputText onChange={handleChange} label="User Name" value={loginData.name} inputName={'name'} required />
                <InputText onChange={handleChange} label="Email" value={loginData.email} inputName={'email'} required />
                <InputText onChange={handleChange} label="Password" value={loginData.password} inputName={'password'} required />
                <Button label='submit' isLoading={isLoading} />
            </form>
        </>
    )
}

