import React from 'react'
import { placeholderIcons } from '../utils/Placeholder'

type Props = {}

export const MyList = (props: Props) => {
    return (
        <div className="w-full md:w-1/3 bg-white overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 11, 13].map((user) => (
                <div key={user} className="p-4 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                        {placeholderIcons[user % placeholderIcons.length]}
                    </div>
                    <p className="font-medium text-gray-800">User {user}</p>
                </div>
            ))}
        </div>
    )
}