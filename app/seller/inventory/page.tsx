'use client';

import { useCallback, useEffect, useState } from "react";
import useInventory from "@/hooks/useInventory";
import { useUser } from "@/contexts/userContext";
import SearchInput from "@/components/both/input-search";
import CarGrid from "@/components/both/car-grid";
import { InventoryItem } from "@/models/inventory";
import { FaPlus } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/loader";

const Inventory = () => {
    const { user } = useAuth();
    const { inventory, removeVehicle: deleteVehicleFromInventory } = useInventory(user?.uid ?? '');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, [inventory]);

    const onDelete = useCallback(({ vehicles: vehicleToDelete }: InventoryItem) => {        
        deleteVehicleFromInventory(vehicleToDelete.vehicleId);
    }, []);

    return (
        <>
            <div className="p-4">
                <SearchInput setValue={setSearchQuery} value={searchQuery} />
                <br />
                <div className="flex justify-between items-center mb-4">
                    <strong className="font-extrabold text-lg">Adicionar veículo</strong>
                    <Link
                        className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
                        href='/seller/inventory/new'
                    >
                        <FaPlus size={16} />
                    </Link>
                </div>
                <strong className="font-extrabold text-lg">Stock</strong>
                {isLoading && (
                    <div className='w-full h-screen flex items-start justify-center'>
                        <Loader />
                    </div>
                )}
                {!isLoading && (
                    <CarGrid inventory={inventory} searchOnList={searchQuery} onDelete={onDelete} />
                )}
            </div>
            <br /><br />
        </>
    );
};

export default Inventory;