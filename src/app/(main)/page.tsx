"use client";
import { useEffect, useState } from "react";

import { ChatSection } from "@/components/chat/ChatSection";
import { MyList } from "@/components/chat/MyList";
import { UserList } from "@/components/chat/UserList";
import { myListAction, userListAction } from "@/actions/chatActions";

import { User } from "@prisma/client";

export default function Home() {

  const [userList, setUserList] = useState<User[]>([]);
  const [myList, setMyList] = useState<any[]>([]);

  const loadInitialData = async () => {
    const users = await userListAction();
    const lists = await myListAction();
    setUserList(users);
    setMyList(lists);
  };

  useEffect(() => {
    loadInitialData();
  }, []);


  const handleConversationCreated = async () => {
    await loadInitialData();
  };

  return (
    <div className="flex flex-col bg-gray-100 max-h-[80vh] rounded-lg shadow-md">

      <UserList userList={userList} onConversationCreated={handleConversationCreated} />

      {/* Divider */}
      <div className="w-full h-3 bg-gradient-to-r bg-grey-50"></div>

      <div className="flex flex-1 overflow-hidden xs:overflow-auto">
        <MyList myList={myList} />
        <ChatSection />
      </div>

    </div>
  );
}
