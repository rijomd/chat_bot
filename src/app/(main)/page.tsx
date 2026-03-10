"use client";
import { useEffect, useState } from "react";

import { ChatSection } from "@/components/chat/ChatSection";
import { MyList } from "@/components/chat/MyList";
import { UserList } from "@/components/chat/UserList";
import { myListAction, userListAction, chatbotListAction, createChatbotConversation } from "@/actions/chatActions";
import { useSupabaseRealtimeChat } from "@/lib/useSupabaseRealtimeChat";

import { User } from "@prisma/client";
import ChatSkeleton from "@/components/chat/ChatSkeleton";
import { useSession } from "next-auth/react";
import { Chatbot } from "@/types/chatbot";

export default function Home() {

  const { data: session } = useSession();
  const [userList, setUserList] = useState<User[]>([]);
  const [myList, setMyList] = useState<any[]>([]);
  const [chatbotList, setChatbotList] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [selectedChatbot, setSelectedChatbot] = useState<Chatbot | null>(null);
  const [chatbotConversationId, setChatbotConversationId] = useState<string | null>(null);
  const { joinConversation, isLoading, currentConversation, messages } = useSupabaseRealtimeChat();

  const loadInitialData = async () => {
    setLoading(true);
    const users = await userListAction();
    const lists = await myListAction();
    const chatBots = await chatbotListAction();

    setUserList(users);
    setMyList(lists);
    setChatbotList(chatBots || []);
    setLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleConversationCreated = async () => {
    await loadInitialData();
  };

  const handleChatWithUser = (item: any) => {
    setSelectedUser(item);
    setSelectedChatbot(null);
    setChatbotConversationId(null);

    if (item?.id) {
      joinConversation(item.id);
    }
  };

  const handleSelectChatbot = async (chatbot: Chatbot) => {
    setSelectedChatbot(chatbot);
    setSelectedUser(null);

    const result = await createChatbotConversation(chatbot.id);
    if (result.success) {
      setChatbotConversationId(result.data.id);
    }
  };

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <div className="flex flex-col bg-gray-100 max-h-[80vh] rounded-lg shadow-md">

      <UserList userList={userList} onConversationCreated={handleConversationCreated} />

      {/* Divider */}
      <div className="w-full h-3 bg-gradient-to-r bg-grey-50"></div>

      <div className="flex flex-1 overflow-hidden xs:overflow-auto min-h-[50vh] mt-2">
        <MyList
          myList={myList}
          chatbotList={chatbotList}
          handleChatWithUser={handleChatWithUser}
          selectChatbot={handleSelectChatbot}
          selectedUser={selectedUser}
          selectedChatbot={selectedChatbot}
        />
        <ChatSection
          selectedUser={selectedUser}
          selectedChatbot={selectedChatbot}
          currentUserId={Number(session?.user?.id || 0)}
          currentUserName={session?.user?.name || "User"}
          isLoading={isLoading}
          currentConversation={currentConversation}
          messages={messages}
          chatbotConversationId={chatbotConversationId}
        />
      </div>

    </div>
  );
}
