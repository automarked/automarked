import { FC, useEffect } from "react";
import { Menu } from "lucide-react";
import { Chat } from "@/models/chatMessage";
import Image from "next/image";
import { useMaterialLayout } from "@/contexts/LayoutContext";

const ChatHeader: FC<Chat> = ({ chatWith }) => {
  const { toggleSidebar } = useMaterialLayout()

  useEffect(() => {

    console.log("CHAT WITH", chatWith);
  }, [chatWith])
  
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-white shadow-md">
      {/* Avatar e informações */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold">
          <Image
            src={chatWith.photo}
            alt={chatWith.name}
            width={300}
            height={300}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-800">{chatWith.name}</h2>
          <p className="text-xs text-gray-500">Lida</p>
        </div>
      </div>

      {/* Ações */}
      <div onClick={() => toggleSidebar()}  className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Menu className='cursor-pointer' size={24} />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
