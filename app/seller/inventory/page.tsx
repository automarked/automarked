'use client'

import { useCallback, useState } from "react";
import useInventory from "@/hooks/useInventory";
import { useUser } from "@/contexts/userContext";
import SearchInput from "@/components/both/input-search";
import CarGrid from "@/components/both/car-grid";
import { InventoryItem } from "@/models/inventory";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Inventory = () => {
    const { user } = useUser()
    const { profile } = useUser(user?.uid ?? '')
    const { inventory, removeVehicle: deleteVehicleFromInventory } = useInventory(profile?.companyId ?? '')
    const [searchQuery, setSearchQuery] = useState('')

    const onDelete = useCallback(({ vehicles: vehicleToDelete }: InventoryItem) => {
        deleteVehicleFromInventory(vehicleToDelete.vehicleId);
    }, []);

    return (
        <>
            <br /><br />
        </>
    );
};

export default Inventory;