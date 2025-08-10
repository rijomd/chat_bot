"use client"
import React from 'react'

type Props = {
    label: string, type?: string, value: string | number,
    onChange: (inputName: string, e: string | number) => void,
    required?: boolean, inputName: string
}

export const InputText = ({ label, type, value, onChange, required, inputName }: Props) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type || "text"}
                value={value}
                name={inputName}
                onChange={(e) => onChange(inputName, e.target.value)}
                required={required || false}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                placeholder={label}
            />
        </div>
    )
}