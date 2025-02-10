import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome, FaCar, FaComment, FaUserAlt } from "react-icons/fa";
import { Megaphone } from "lucide-react";
import { useNotificationContext } from "@/contexts/notificationContext";

const NavbarSeller: React.FC<{ userId: string, menuOpen: boolean, setMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  userId,
  menuOpen,
  setMenuOpen
}) => {
  const [activeMenu, setActiveMenu] = useState<string>("/");
  const router = useRouter();
  const { unreadMessagesCount } = useNotificationContext();

  const handleNavigation = (screen: string) => {
    setActiveMenu(screen);
    router.push(`/seller/${screen.toLowerCase()}`);
  };

  return (
    <div className="fixed top-16 right-2 z-50">
      {menuOpen && (

        <div
          className={`flex flex-col items-start gap-4 transition-all duration-300 ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
        >
          {/* Item do menu - Home */}
          <button
            onClick={() => {
              setActiveMenu("/");
              router.push("/seller");
            }}
            className={`flex items-center p-2 bg-white rounded-full shadow-xl ${activeMenu === "/" ? "border-2 border-[var(--orange-dark)]" : "border"
              }`}
          >
            <FaHome size={20} color={activeMenu === "/" ? "var(--orange-dark)" : "#ccc"} />
            {/* <span
            className={`text-sm ${
              activeMenu === "/" ? "text-[var(--orange-dark)]" : "text-[#333]"
            }`}
          >
            Home
          </span> */}
          </button>

          {/* Item do menu - Inventory */}
          <button
            onClick={() => handleNavigation("Inventory")}
            className={`flex items-center p-2 bg-white rounded-full shadow-xl ${activeMenu === "Inventory" ? "border-2 border-[var(--orange-dark)]" : "border"
              }`}
          >
            <FaCar
              size={20}
              color={activeMenu === "Inventory" ? "var(--orange-dark)" : "#ccc"}
            />
            {/*  <span
            className={`text-sm ${
              activeMenu === "Inventory" ? "text-[var(--orange-dark)]" : "text-[#333]"
            }`}
          >
            Inventário
          </span> */}
          </button>

          {/* Item do menu - Ads */}
          <button
            onClick={() => handleNavigation("Ads")}
            className={`flex items-center p-2 bg-white rounded-full shadow-xl ${activeMenu === "Ads" ? "border-2 border-[var(--orange-dark)]" : "border"
              }`}
          >
            <Megaphone
              size={20}
              color={activeMenu === "Ads" ? "var(--orange-dark)" : "#ccc"}
            />
            {/* <span
            className={`text-sm ${
              activeMenu === "Ads" ? "text-[var(--orange-dark)]" : "text-[#333]"
            }`}
          >
            Anúncios
          </span> */}
          </button>

          {/* Item do menu - Chat */}
          <button
            onClick={() => handleNavigation("Chat")}
            className={`flex items-center p-2 bg-white rounded-full shadow-xl relative ${activeMenu === "Chat" ? "border-2 border-[var(--orange-dark)]" : "border"
              }`}
          >
            <FaComment
              size={20}
              color={activeMenu === "Chat" ? "var(--orange-dark)" : "#ccc"}
            />
            {/* <span
            className={`text-sm ${
              activeMenu === "Chat" ? "text-[var(--orange-dark)]" : "text-[#333]"
            }`}
          >
            Chat
          </span> */}
            {unreadMessagesCount > 0 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--orange-dark)] flex items-center justify-center">
                <span className="text-xs text-white">{unreadMessagesCount}</span>
              </div>
            )}
          </button>

          {/* Item do menu - Profile */}
          <button
            onClick={() => handleNavigation("Profile")}
            className={`flex items-center p-2 bg-white rounded-full shadow-xl ${activeMenu === "Profile" ? "border-2 border-[var(--orange-dark)]" : "border"
              }`}
          >
            <FaUserAlt
              size={20}
              color={activeMenu === "Profile" ? "var(--orange-dark)" : "#ccc"}
            />
            {/* <span
            className={`text-sm ${
              activeMenu === "Profile" ? "text-[var(--orange-dark)]" : "text-[#333]"
            }`}
          >
            Conta
          </span> */}
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarSeller;
