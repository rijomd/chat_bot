import React from 'react'

type Props = {}

export const UserList = (props: Props) => {
    return (
        <div className="w-full bg-white shadow-sm p-3 overflow-x-auto overflow-y-hidden no-scrollbar flex-shrink-0">
            <div className="flex gap-4 min-w-max">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((item) => (
                    <div key={item} className=" w-[140px]  flex flex-col items-center py-3 px-4" style={{ boxShadow: '0px 1px 8px 1px #c3e5c3' }}>
                        <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-pink-400 to-emerald-400 shadow-md hover:shadow-lg transition-shadow">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center ring-2 ring-white">
                                <img
                                    src={item % 2 === 0 ? '/user.png' : '/user2.png'}
                                    alt={`User ${item}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <span className="text-xs mt-2 text-gray-700">User {item}</span>
                        <span className="mt-2 text-white h-[24px] w-full cursor-pointer  p-1  bg-green-600 shadow-md hover:shadow-lg transition-shadow flex items-center justify-center hover:scale-110"> + </span>
                    </div>
                ))}
            </div>
        </div>
    )
}