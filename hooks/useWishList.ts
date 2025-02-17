import { useCallback, useState, useEffect } from "react";
/* import { Alert } from "react-native"; */
import { createdInstance } from "./useApi";
import { Vehicle } from "@/models/vehicle";
import { toast } from "./use-toast";

export default function useWishlist(userId: string) {
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    if (!userId) {
        throw new Error("O ID do usuário é obrigatório para inicializar a hook useWishlist.");
    }

    const [wishList, setWishList] = useState<Vehicle[]>([]);

    const addOnWishList = useCallback(async (vehicle: Vehicle) => {
        const response = await createdInstance.post<Vehicle[]>(`/${userId}/vehicles`, vehicle);
        if (response.status === 201) {
            setWishList(response.data);
            showToast("Sucesso!",`${vehicle.brand + ' ' + vehicle.model} adicionado à lista de desejos!`)
        }
    }, [userId]);

    const getWishList = useCallback(async () => {
        const response = await createdInstance.get<Vehicle[]>(`/${userId}/vehicles`);
        if (response.status === 200) {
            setWishList(response.data);
        }
    }, [userId]);

    const deleteFromWishList = useCallback(async (vehicleId: string) => {
        const response = await createdInstance.delete<Vehicle[]>(`/${userId}/vehicles/${vehicleId}`);
        if (response.status === 200) {
            setWishList(response.data);
            showToast("Sucesso!", "Veículo removido com sucesso!")
        }
    }, [userId]);

    useEffect(() => {
        getWishList();
    }, [getWishList]);

    return {
        wishList,
        actions: {
            addOnWishList,
            deleteFromWishList,
        }
    };
}
