import { useState, useEffect, useCallback } from "react";
import { Vehicle } from "@/models/vehicle";
import { InventoryItem } from "@/models/inventory";
import { createdInstance } from "./useApi";
import { toast } from "./use-toast";

interface UseInventoryResult {
    inventory: InventoryItem[];
    loading: boolean;
    error: string | null;
    fetchInventory: () => void;
    addVehicle: (vehicle: Vehicle, quantity: number) => void;
    updateVehicleQuantity: (vehicleId: string, quantity: number) => void;
    removeVehicle: (vehicleId: string) => void;
    totalInventoryValue: number;
    fetchTotalInventoryValue: () => void;
}

const useInventory = (userId: string): UseInventoryResult => {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [totalInventoryValue, setTotalInventoryValue] = useState<number>(0);
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        console.log('ESTE È O USER ID ', userId);

        try {
            const response = await createdInstance.get<InventoryItem[]>(`/inventory/${userId}`);
            setInventory(response.data);            
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchTotalInventoryValue = useCallback(async () => {
        setLoading(true); // para mostrar que está carregando
        try {
            const response = await createdInstance.get<{ totalValue: number }>(`/inventory/total/${userId}`);
            setTotalInventoryValue(response.data.totalValue);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId]);


    const addVehicle = async (vehicle: Vehicle, quantity: number) => {
        try {
            const response = await createdInstance.post<{ message: string }>("/inventory/add", { userId, vehicle, quantity });
            if (response.status === 200) {

                showToast("Sucesso!", `Seu ${vehicle.brand} ${vehicle.model} foi adicionando com sucesso ao seu inventário!`)
                fetchInventory();
                fetchTotalInventoryValue();
            } else if (response.status === 201)
                showToast("Erro!", response.data.message)
        } catch (err: any) {
            setError(err.message);
        }
    };

    const updateVehicleQuantity = async (vehicleId: string, quantity: number) => {
        try {
            await createdInstance.put("/inventory/update", { userId, vehicleId, quantity });
            fetchInventory();
            fetchTotalInventoryValue();
        } catch (err: any) {
            setError(err.message);
        }
    };

    const removeVehicle = async (vehicleId: string) => {
        try {
            const response = await createdInstance.get<InventoryItem[]>(`/inventory/${userId}`);
            const vehicle = response.data.find(inv => inv.vehicles.vehicleId === vehicleId)

            if (!vehicle) return

            await createdInstance.delete(`/inventory/${userId}/remove/${vehicleId}`);
            showToast("Sucesso!", `O Veículo ${vehicle.vehicles.brand} ${vehicle.vehicles.model} matrícula ${vehicle.vehicles.licensePlate} foi removido com sucesso do seu inventário!`)
            setInventory(inventory.filter(inv => inv.vehicles.vehicleId !== vehicleId))
            fetchInventory();
            fetchTotalInventoryValue();
        } catch (err: any) {
            showToast("Erro ao deletar!", `Não foi possivel remover o veículo do seu inventário!\n Por favor, aguarde e tente novamente daqui a alguns segundos, se o problema perssistir entre em contacto com a equipe técnica ou reporte o erro ao seu responsável.`)
            setError(err.message);
            console.log(err.message)
        }
    };

    useEffect(() => {
        let isMounted = true; // controle de montagem
        const fetchData = async () => {
            await fetchInventory();
            if (isMounted) await fetchTotalInventoryValue();
        };
        fetchData();
        return () => {
            isMounted = false; // impede atualizações após desmontagem
        };
    }, [userId]);

    return {
        inventory,
        loading,
        error,
        fetchInventory,
        addVehicle,
        updateVehicleQuantity,
        removeVehicle,
        totalInventoryValue,
        fetchTotalInventoryValue,
    };
};

export default useInventory;
