"use client";

import { ChatSection } from "@/components/chat/ChatSection";
import { MyList } from "@/components/chat/MyList";
import { UserList } from "@/components/chat/UserList";

export default function Home() {

  return (
    <div className="flex flex-col bg-gray-100 max-h-[80vh] rounded-lg shadow-md">

      <UserList />

      {/* Divider */}
      <div className="w-full h-3 bg-gradient-to-r bg-grey-50"></div>

      <div className="flex flex-1 overflow-hidden xs:overflow-auto">
        <MyList />
        <ChatSection />
      </div>

    </div>
  );
}
