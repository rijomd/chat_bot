import React, { useState } from 'react'

type Props = {}

export const ChatSection = (props: Props) => {
    const [message, setMessage] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    return (
        <div className="hidden md:flex flex-col w-2/3 bg-gray-50">
            <div className="p-4  bg-white shadow-sm">
                <h2 className="font-semibold">Chat with User</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="bg-white p-3 rounded-lg w-fit shadow">
                    Hello 👋
                </div>

                <div className="bg-green-500 text-white p-3 rounded-lg w-fit ml-auto">
                    Hi!
                </div>
            </div>

            <div className="p-3  bg-white flex gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none"
                    onChange={handleChange}
                    value={message}
                />
                <button className="bg-green-500 text-white px-4 rounded-lg">
                    Send
                </button>
            </div>
        </div>
    )
}