'use client'

import CarViewer from "@/components/both/car-viewer";
import { useInventoryContext } from "@/contexts/InventoryContext";
import { useUser } from "@/contexts/userContext";
import { createdInstance } from "@/hooks/useApi";
import { Vehicle } from "@/models/vehicle";
import { useCallback, useEffect, useState } from "react";

export default function CardDetail({ params }: { params: { id: string } }) {
    const { user } = useUser()
    const { removeVehicle: deleteVehicleFromInventory } = useInventoryContext()

    const onDelete = useCallback((vehicleToDelete: Vehicle) => {
        deleteVehicleFromInventory(vehicleToDelete.vehicleId);
    }, []);

    const [vehicle, setVehicle] = useState<Vehicle>()
    const getById = useCallback(async (id: string) => {
        const response = await createdInstance.get<{ record: Vehicle }>('/vehicles/'+id)
        if (response.status <= 201) setVehicle(response.data.record)
    }, [user, params])

    useEffect(() => {
        getById(params.id)
    }, [user, params])

    if (vehicle && user)
    return (
        <>
            <CarViewer user={user} type="seller" onDelete={onDelete} vehicle={vehicle}/>
        </>
    )
}