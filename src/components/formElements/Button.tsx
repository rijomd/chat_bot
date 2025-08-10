import React from 'react'

type Props = {
    label: string,
    onClick?: () => void
}

export const Button = ({ label, onClick }: Props) => {
    return (
        <>
            <button
                type="submit"
                onClick={onClick}
                className="cursor-pointer w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[.98] transition"
            >
                {label}
            </button>
        </>
    )
}