import React from 'react'

type Props = {
    label: string,
    onClick?: () => void,
    isLoading?: boolean
}

export const Button = ({ label, onClick, isLoading = false }: Props) => {
    return (
        <>
            <button
                type="submit"
                onClick={onClick}
                className="cursor-pointer w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-[.98] transition"
            >
                {isLoading ? "Loading..." : label}
            </button>
        </>
    )
}