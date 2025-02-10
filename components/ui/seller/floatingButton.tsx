import React from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import { IUser } from '@/models/user';

interface FloatingButtonAddVehicleProps {
    user: IUser;
}

const FloatingButtonAddVehicle: React.FC = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('/seller/inventory/new');
        console.log('Botão flutuante pressionado!');
    };

    return (
        <button
            onClick={handlePress}
            className="fixed z-[999] bottom-24 right-4 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
        >
            <FaPlus size={24} />
        </button>
    );
};

export default FloatingButtonAddVehicle;
