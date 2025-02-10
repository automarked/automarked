'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Menu, MessageCircleReplyIcon, Search, ShoppingCart, X } from 'lucide-react';
import Image from 'next/image';
import NavbarSeller from './navbar-seller';
import { useUser } from '@/contexts/userContext';
import { FaComment } from 'react-icons/fa';
import { BsChatLeftText } from "react-icons/bs";
import { useNotificationContext } from '@/contexts/notificationContext';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { useMaterialLayout } from '@/contexts/LayoutContext';
import { Badge } from '../badge';

const AppSellerHeader: React.FC<{ user: { uid: string, name: string, email: string }, toggleSidebar: () => void }> = ({
  user
}) => {
  const router = useRouter();
  const { profile, imageURL } = useUser(user.uid)
  const { unreadNotifications, unreadMessagesCount } = useNotificationContext()
  const { vehicles } = useShoppingCart()
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const { toggleSidebar, isOpen } = useMaterialLayout()

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
              <Badge variant={"outline"}>Cliente</Badge><br />
              <strong>{profile.firstName} {profile.lastName}</strong>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
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
        <div className="relative cursor-pointer" onClick={() => {
          router.push('/seller/shopping-cart');
        }}>
          <ShoppingCart />
          {vehicles.length > 0 && (
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
              {vehicles.length}
            </div>
          )}
        </div>
        {isOpen && (
          <X className='cursor-pointer rounded-full w-8 h-8 bg-gray-200' size={24} onClick={() => toggleSidebar()} />
        )}
        {!isOpen && (
          <Menu className='cursor-pointer' size={24} onClick={() => toggleSidebar()} />
        )}
      </div>
    </div>
  );
};

export default AppSellerHeader;