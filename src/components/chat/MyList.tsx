import React from 'react'
import { placeholderIcons } from '../utils/Placeholder'

type Props = {
    myList: any[]
}

export const MyList = ({ myList }: Props) => {
    return (
        <div className="w-full md:w-1/3 bg-white overflow-y-auto">
            {myList?.length > 0 && myList.map((item, index) => (
                <div key={index} className="p-4 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                        {placeholderIcons[index % placeholderIcons.length]}
                    </div>
                    <p className="font-medium text-gray-800">{item.participants[0]?.name}</p>
                </div>
            ))}

            {myList?.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                    No conversations yet
                </div>
            )}

        </div>
    )
}