import React from 'react'
import { placeholderIcons } from '../utils/Placeholder'
import { AIButton } from '../formElements/AIButton';
import { Chatbot } from '@/types/chatbot';

type Props = {
    myList: any[];
    handleChatWithUser: (item: any) => void;
    selectedUser: any | null;
    selectChatbot: (chatbot: Chatbot) => void;
    chatbotList: Chatbot[];
    selectedChatbot: Chatbot | null;
}

export const MyList = ({ 
    myList, 
    handleChatWithUser, 
    selectedUser,
    selectChatbot,
    chatbotList,
    selectedChatbot
}: Props) => {
    return (
        <div className="w-full md:w-1/3 bg-white overflow-y-auto no-scrollbar relative">
            <AIButton selectChatOption={selectChatbot} chatBots={chatbotList} />
            {myList?.length > 0 && myList.map((item, index) => (
                <div
                    onClick={() => handleChatWithUser(item)}
                    key={index}
                    className={`p-4 hover:bg-green-50 cursor-pointer flex items-center gap-3 transition-colors  ${selectedUser?.id === item?.id ? 'bg-green-100 border-l-4 border-green-500' : ''
                        }`}
                >
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                        {placeholderIcons[index % placeholderIcons.length]}
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.participants[0]?.name}</p>
                        <p className="text-xs text-gray-500">{item.participants[0]?.email}</p>
                    </div>
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
