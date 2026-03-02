"use client";
import { useEffect, useState } from "react";

import { ChatSection } from "@/components/chat/ChatSection";
import { MyList } from "@/components/chat/MyList";
import { UserList } from "@/components/chat/UserList";
import { myListAction, userListAction } from "@/actions/chatActions";
import { useSupabaseRealtimeChat } from "@/lib/useSupabaseRealtimeChat";

import { User } from "@prisma/client";
import ChatSkeleton from "@/components/chat/ChatSkeleton";
import { useSession } from "next-auth/react";

export default function Home() {

  const { data: session } = useSession();
  const [userList, setUserList] = useState<User[]>([]);
  const [myList, setMyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const { joinConversation, isLoading, currentConversation, messages } = useSupabaseRealtimeChat();

  const loadInitialData = async () => {
    setLoading(true);
    const users = await userListAction();
    const lists = await myListAction();
    setUserList(users);
    setMyList(lists);
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
    if (item?.id) {
      joinConversation(item.id);
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

      <div className="flex flex-1 overflow-hidden xs:overflow-auto min-h-[50vh]">
        <MyList myList={myList} handleChatWithUser={handleChatWithUser} selectedUser={selectedUser} />
        <ChatSection
          selectedUser={selectedUser}
          currentUserId={Number(session?.user?.id || 0)}
          currentUserName={session?.user?.name || "User"}
          isLoading={isLoading}
          currentConversation={currentConversation}
          messages={messages}
        />
      </div>

    </div>
  );
}
