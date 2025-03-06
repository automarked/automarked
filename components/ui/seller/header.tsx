'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Menu, MessageCircleReplyIcon, Search, X } from 'lucide-react';
import Image from 'next/image';
import NavbarSeller from './navbar-seller';
import { useUser } from '@/contexts/userContext';
import { FaComment } from 'react-icons/fa';
import { BsChatLeftText } from "react-icons/bs";
import { useNotificationContext } from '@/contexts/notificationContext';
import { Badge } from '../badge';
import { profileType } from '@/utils/profileType';
import { useMaterialLayout } from '@/contexts/LayoutContext';

const AppSellerHeader: React.FC<{ user: { uid: string, name: string, email: string }, toggleSidebar: () => void }> = ({
  user,
  toggleSidebar
}) => {
  const router = useRouter();
  const { profile, imageURL } = useUser(user.uid)
  const { unreadNotifications, unreadMessagesCount } = useNotificationContext()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const { isOpen } = useMaterialLayout()


  useEffect(() => {

  }, [imageURL])
  return (
    <div className="flex justify-between items-center p-4  bg-transparent">
      <div className="flex items-center space-x-2 cursor-pointer" >
        {profile && (
          <div className='flex items-center gap-2'>
            <Image
              onClick={() => router.push('/seller/profile')}
              src={imageURL}
              alt="User Avatar"
              width={150}
              height={150}
              className="w-12 border-[var(--black)] border-2 p-0.5 h-12 object-cover rounded-full cursor-pointer"
            />
            <div>
              <Badge variant={"outline"}>{profileType[profile.type]}</Badge><br />
              <strong>{profile.firstName} {profile.lastName}</strong>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* <div className="relative cursor-pointer" onClick={() => {
          
        }}>
          <Search size={22} fontWeight={800} />
        </div> */}
        <div className="relative cursor-pointer" onClick={() => {
          router.push('/seller/chat');
        }}>
          <BsChatLeftText size={22} fontWeight={800} />
          {unreadMessagesCount > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadMessagesCount}
            </div>
          )}
        </div>
        <div className="relative cursor-pointer" onClick={() => {
          router.push('/seller/notifications');
        }}>
          <Bell />
          {unreadNotifications.length > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadNotifications.length}
            </div>
          )}
        </div>
        <div className="w-7 h-7 flex justify-center items-center">
          {isOpen && (
            <X className='cursor-pointer rounded-full bg-gray-200 w-full h-full p-1' onClick={() => toggleSidebar()} />
          )}
          {!isOpen && (
            <Menu className='cursor-pointer' size={24} onClick={() => toggleSidebar()} />
          )}
        </div>
        <NavbarSeller setMenuOpen={setMenuOpen} menuOpen={menuOpen} userId={user.uid} />
      </div>
    </div>
  );
};

export default AppSellerHeader;